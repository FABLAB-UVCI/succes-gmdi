<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\EquipementPublic;
use App\Modules\Urbanisme\Models\Parcelle;
use App\Modules\Urbanisme\Models\Permis;
use App\Modules\Urbanisme\Models\Lotissement;
use App\Modules\Urbanisme\Models\ReseauElectrique;
use App\Modules\Urbanisme\Models\ReseauHydraulique;
use Illuminate\Http\Request;

// ═════════════════════════════════════════════════════════════════════════════
//  EquipementController — Équipements publics géolocalisés
// ═════════════════════════════════════════════════════════════════════════════

class EquipementController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    /**
     * GET /api/urb/equipements
     * Filtres : type, quartier, etat
     */
    public function index(Request $request)
    {
        $q = EquipementPublic::query()->orderBy('type')->orderBy('nom');
        if ($t  = $request->get('type'))    $q->where('type', $t);
        if ($qr = $request->get('quartier'))$q->where('quartier', $qr);
        if ($e  = $request->get('etat'))    $q->where('etat', $e);
        $data = $q->paginate(50);
        return response()->json(['data'=>$data->map(fn($e)=>$this->fmt($e)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    /**
     * POST /api/urb/equipements
     */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'             => 'required|string|max:200',
            'type'            => 'required|in:ecole,sante,marche,espace_vert,sport,culte,securite,autre',
            'adresse'         => 'required|string|max:250',
            'quartier'        => 'required|string|max:150',
            'lat'             => 'required|numeric|between:-90,90',
            'lng'             => 'required|numeric|between:-180,180',
            'capacite'        => 'nullable|integer|min:0',
            'etat'            => 'nullable|in:bon,moyen,degrade',
            'responsable'     => 'nullable|string|max:200',
            'annee_construction'=> 'nullable|integer|min:1900|max:' . date('Y'),
        ]);
        $eq = EquipementPublic::create(array_merge($v, ['etat'=>$v['etat']??'bon']));
        return response()->json(['success'=>true,'message'=>"Équipement géolocalisé — {$eq->nom}",'data'=>$this->fmt($eq)], 201);
    }

    /**
     * GET /api/urb/equipements/{id}
     */
    public function show($id)
    {
        return response()->json(['success'=>true,'message'=>'OK','data'=>$this->fmt(EquipementPublic::findOrFail($id))]);
    }

    /**
     * PUT /api/urb/equipements/{id}
     */
    public function update(Request $request, $id)
    {
        $eq = EquipementPublic::findOrFail($id);
        $eq->update($request->validate(['nom'=>'sometimes|string|max:200','etat'=>'sometimes|in:bon,moyen,degrade','capacite'=>'nullable|integer','responsable'=>'nullable|string|max:200','lat'=>'sometimes|numeric','lng'=>'sometimes|numeric']));
        return response()->json(['success'=>true,'message'=>'Équipement mis à jour.','data'=>$this->fmt($eq->fresh())]);
    }

    /**
     * GET /api/urb/equipements/type/{type}
     */
    public function byType($type)
    {
        $data = EquipementPublic::where('type', $type)->orderBy('nom')->get()->map(fn($e)=>$this->fmt($e));
        return response()->json(['data'=>$data,'total'=>$data->count()]);
    }

    private function fmt(EquipementPublic $e): array
    {
        return ['id'=>$e->id,'nom'=>$e->nom,'type'=>$e->type,'adresse'=>$e->adresse,'quartier'=>$e->quartier,'coordonnees'=>['lat'=>$e->lat,'lng'=>$e->lng],'capacite'=>$e->capacite,'etat'=>$e->etat,'responsable'=>$e->responsable,'annee_construction'=>$e->annee_construction,'created_at'=>$e->created_at?->toISOString()];
    }
}

// ═════════════════════════════════════════════════════════════════════════════
//  StatsUrbanismeController — Dashboard KPIs
// ═════════════════════════════════════════════════════════════════════════════

class StatsUrbanismeController extends Controller
{
    /**
     * GET /api/urb/statistiques
     * Retourne KpiUrbanisme Angular
     */
    public function dashboard()
    {
        $totalParcelles  = Parcelle::count();
        $permisPendants  = Permis::whereIn('statut', ['depose','instruction'])->count();
        $permisMois      = Permis::whereMonth('date_depot', now()->month)->whereYear('date_depot', now()->year)->count();
        $lotissActifs    = Lotissement::whereIn('statut', ['approuve','en_cours'])->count();

        // Taux couverture électrique (moyenne)
        $tauxElec = ReseauElectrique::avg('taux_couverture') ?? 0;
        // Taux couverture hydraulique (moyenne)
        $tauxEau  = ReseauHydraulique::avg('taux_couverture') ?? 0;

        $nbEquipements   = EquipementPublic::count();

        // Répartition parcelles par statut
        $repStatuts = Parcelle::selectRaw('statut, COUNT(*) as nb')
            ->groupBy('statut')->get()
            ->map(fn($r)=>['statut'=>$r->statut,'nb'=>(int)$r->nb]);

        // Répartition équipements par type
        $repEquip = EquipementPublic::selectRaw('type, COUNT(*) as nb')
            ->groupBy('type')->orderByDesc('nb')->get()
            ->map(fn($r)=>['type'=>$r->type,'nb'=>(int)$r->nb]);

        // Permis par type ce mois
        $repPermis = Permis::selectRaw('type, COUNT(*) as nb')
            ->whereMonth('date_depot', now()->month)
            ->groupBy('type')->get()
            ->map(fn($r)=>['type'=>$r->type,'nb'=>(int)$r->nb]);

        return response()->json([
            'kpi' => [
                'total_parcelles'         => $totalParcelles,
                'permis_mois'             => $permisMois,
                'permis_pendants'         => $permisPendants,
                'lotissements_actifs'     => $lotissActifs,
                'taux_couverture_elec'    => round($tauxElec, 1),
                'taux_couverture_eau'     => round($tauxEau, 1),
                'equipements_geolocalisés'=> $nbEquipements,
            ],
            'repartition_parcelles' => $repStatuts,
            'repartition_equipements' => $repEquip,
            'permis_par_type' => $repPermis,
        ]);
    }

    /**
     * GET /api/urb/export?type=parcelles|permis|equipements|all
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'all');
        $data = match ($type) {
            'parcelles'    => Parcelle::all(),
            'permis'       => Permis::all(),
            'equipements'  => EquipementPublic::all(),
            default        => [
                'parcelles'   => Parcelle::all(),
                'permis'      => Permis::all(),
                'equipements' => EquipementPublic::all(),
                'exported_at' => now()->toISOString(),
            ],
        };
        $filename = "urbanisme_{$type}_" . now()->format('Y-m-d') . '.json';
        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, ['Content-Type' => 'application/json']);
    }
}
