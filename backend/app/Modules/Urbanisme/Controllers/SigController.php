<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\Quartier;
use App\Modules\Urbanisme\Models\CoucheVoirie;
use App\Modules\Urbanisme\Models\ReseauElectrique;
use App\Modules\Urbanisme\Models\ReseauHydraulique;
use Illuminate\Http\Request;

class SigController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ── Quartiers ─────────────────────────────────────────────────────────────

    public function indexQuartiers(Request $request)
    {
        $data = Quartier::query()->orderBy('nom')->paginate(30);
        return response()->json(['data'=>$data->map(fn($q)=>$this->fmtQ($q)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeQuartier(Request $request)
    {
        $v = $request->validate([
            'nom'        => 'required|string|max:150',
            'code'       => 'nullable|string|max:20',
            'superficie' => 'nullable|numeric|min:0',
            'population' => 'nullable|integer',
            'chef'       => 'nullable|string|max:200',
            'lat'        => 'nullable|numeric',
            'lng'        => 'nullable|numeric',
            'statut'     => 'nullable|string|max:50',
        ]);

        // Auto-générer un code unique si absent
        if (empty($v['code'])) {
            $base = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $v['nom']), 0, 4));
            $n = 1;
            do {
                $code = $base . str_pad($n, 2, '0', STR_PAD_LEFT);
                $n++;
            } while (Quartier::where('code', $code)->exists());
            $v['code'] = $code;
        } else {
            // Vérifier unicité
            if (Quartier::where('code', $v['code'])->exists()) {
                $v['code'] = $v['code'] . '-' . rand(10, 99);
            }
        }

        $q = Quartier::create([
            'nom'        => $v['nom'],
            'code'       => $v['code'],
            'superficie' => $v['superficie'] ?? 0,
            'population' => $v['population'] ?? null,
            'chef'       => $v['chef'] ?? null,
            'lat'        => $v['lat'] ?? null,
            'lng'        => $v['lng'] ?? null,
        ]);
        return response()->json(['success'=>true,'message'=>"Quartier enregistré — {$q->nom}",'data'=>$this->fmtQ($q)], 201);
    }

    public function updateQuartier(Request $request, $id)
    {
        $q = Quartier::findOrFail($id);
        $q->update($request->validate(['nom'=>'sometimes|string|max:150','population'=>'nullable|integer','chef'=>'nullable|string|max:200']));
        return response()->json(['success'=>true,'message'=>'Quartier mis à jour.','data'=>$this->fmtQ($q->fresh())]);
    }

    private function fmtQ(Quartier $q): array
    {
        return ['id'=>$q->id,'nom'=>$q->nom,'code'=>$q->code,'superficie'=>$q->superficie,'population'=>$q->population,'chef'=>$q->chef,'coordonnees'=>$q->lat ? ['lat'=>$q->lat,'lng'=>$q->lng] : null,'nb_parcelles'=>$q->nombre_parcelles ?? null,'nombre_parcelles'=>$q->nombre_parcelles ?? null,'created_at'=>$q->created_at?->toISOString()];
    }

    // ── Voiries SIG ───────────────────────────────────────────────────────────

    public function indexVoiries(Request $request)
    {
        $q = CoucheVoirie::query()->orderBy('nom');
        if ($t = $request->get('type'))  $q->where('type', $t);
        if ($e = $request->get('etat'))  $q->where('etat', $e);
        $data = $q->paginate(30);
        return response()->json(['data'=>$data->map(fn($v)=>$this->fmtV($v)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeVoirie(Request $request)
    {
        $v = $request->validate([
            'nom'      => 'required|string|max:200',
            'type'     => 'required|in:principale,secondaire,piste',
            'longueur' => 'required|numeric|min:0',
            'largeur'  => 'nullable|numeric|min:0',
            'etat'     => 'nullable|in:bon,moyen,degrade',
            'quartier' => 'required|string|max:150',
        ]);
        $voie = CoucheVoirie::create(array_merge($v, ['etat'=>$v['etat']??'bon']));
        return response()->json(['success'=>true,'message'=>"Voie enregistrée — {$voie->nom}",'data'=>$this->fmtV($voie)], 201);
    }

    public function updateVoirie(Request $request, $id)
    {
        $v = CoucheVoirie::findOrFail($id);
        $v->update($request->validate(['etat'=>'sometimes|in:bon,moyen,degrade','longueur'=>'sometimes|numeric']));
        return response()->json(['success'=>true,'message'=>'Voirie mise à jour.','data'=>$this->fmtV($v->fresh())]);
    }

    private function fmtV(CoucheVoirie $v): array
    {
        return ['id'=>$v->id,'nom'=>$v->nom,'type'=>$v->type,'longueur'=>$v->longueur,'etat'=>$v->etat,'statut'=>$v->etat,'quartier'=>$v->quartier,'created_at'=>$v->created_at?->toISOString()];
    }

    // ── Réseaux combinés (endpoint unifié) ───────────────────────────────────

    public function indexReseaux(Request $request)
    {
        $type = $request->get('type');
        $elec  = [];
        $hydro = [];

        if (!$type || in_array($type, ['HT','MT','BT','electricite'])) {
            $elec = ReseauElectrique::query()->orderBy('zone')->get()->map(fn($r)=>$this->fmtElecAsReseau($r))->toArray();
        }
        if (!$type || in_array($type, ['adduction','assainissement','irrigation','hydraulique'])) {
            $hydro = ReseauHydraulique::query()->orderBy('zone')->get()->map(fn($r)=>$this->fmtHydroAsReseau($r))->toArray();
        }

        $all = array_merge($elec, $hydro);
        return response()->json(['data'=>$all,'meta'=>['total'=>count($all)]]);
    }

    public function storeReseau(Request $request)
    {
        $v = $request->validate([
            'designation' => 'required|string|max:200',
            'type'        => 'required|string|max:100',
            'quartier'    => 'required|string|max:150',
            'longueur'    => 'nullable|numeric|min:0',
            'capacite'    => 'nullable|string|max:100',
            'operateur'   => 'nullable|string|max:100',
        ]);

        // Router selon le type
        $typesElec  = ['HT','MT','BT','electricite','electrique'];
        $typesHydro = ['adduction','assainissement','irrigation','hydraulique'];

        if (in_array(strtolower($v['type']), array_map('strtolower', $typesHydro)) || str_contains(strtolower($v['type']), 'eau') || str_contains(strtolower($v['type']), 'hydro')) {
            $r = ReseauHydraulique::create([
                'zone'           => $v['designation'],
                'type'           => in_array($v['type'], $typesHydro) ? $v['type'] : 'adduction',
                'longueur'       => $v['longueur'] ?? 0,
                'taux_couverture'=> 0,
                'statut'         => 'operationnel',
            ]);
            return response()->json(['success'=>true,'message'=>"Réseau hydraulique enregistré — {$r->zone}",'data'=>$this->fmtHydroAsReseau($r)], 201);
        } else {
            $r = ReseauElectrique::create([
                'zone'           => $v['designation'],
                'type'           => in_array($v['type'], ['HT','MT','BT']) ? $v['type'] : 'MT',
                'longueur'       => $v['longueur'] ?? 0,
                'taux_couverture'=> 0,
                'operateur'      => $v['operateur'] ?? 'CIE',
            ]);
            return response()->json(['success'=>true,'message'=>"Réseau électrique enregistré — {$r->zone}",'data'=>$this->fmtElecAsReseau($r)], 201);
        }
    }

    private function fmtElecAsReseau(ReseauElectrique $r): array
    {
        return ['id'=>$r->id,'designation'=>$r->zone,'type'=>$r->type,'quartier'=>$r->zone,'longueur'=>$r->longueur,'capacite'=>null,'statut'=>'operationnel','categorie'=>'electricite','created_at'=>$r->created_at?->toISOString()];
    }

    private function fmtHydroAsReseau(ReseauHydraulique $r): array
    {
        return ['id'=>$r->id,'designation'=>$r->zone,'type'=>$r->type,'quartier'=>$r->zone,'longueur'=>$r->longueur,'capacite'=>null,'statut'=>$r->statut,'categorie'=>'hydraulique','created_at'=>$r->created_at?->toISOString()];
    }

    // ── Réseau électrique (endpoints séparés) ─────────────────────────────────

    public function indexReseauxElec(Request $request)
    {
        $data = ReseauElectrique::query()->orderBy('zone')->paginate(20);
        return response()->json(['data'=>$data->map(fn($r)=>$this->fmtElec($r)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeReseauElec(Request $request)
    {
        $v = $request->validate(['zone'=>'required|string|max:150','type'=>'required|in:HT,MT,BT','longueur'=>'required|numeric|min:0','taux_couverture'=>'required|integer|between:0,100','operateur'=>'required|string|max:100']);
        $r = ReseauElectrique::create($v);
        return response()->json(['success'=>true,'message'=>"Zone électrique enregistrée — {$r->zone}",'data'=>$this->fmtElec($r)], 201);
    }

    private function fmtElec(ReseauElectrique $r): array
    {
        return ['id'=>$r->id,'zone'=>$r->zone,'type'=>$r->type,'longueur'=>$r->longueur,'taux_couverture'=>$r->taux_couverture,'operateur'=>$r->operateur,'created_at'=>$r->created_at?->toISOString()];
    }

    // ── Réseau hydraulique ────────────────────────────────────────────────────

    public function indexReseauxHydro(Request $request)
    {
        $data = ReseauHydraulique::query()->orderBy('zone')->paginate(20);
        return response()->json(['data'=>$data->map(fn($r)=>$this->fmtHydro($r)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeReseauHydro(Request $request)
    {
        $v = $request->validate(['zone'=>'required|string|max:150','type'=>'required|in:adduction,assainissement,irrigation','longueur'=>'required|numeric|min:0','taux_couverture'=>'required|integer|between:0,100','statut'=>'nullable|in:operationnel,en_travaux,hors_service']);
        $r = ReseauHydraulique::create(array_merge($v, ['statut'=>$v['statut']??'operationnel']));
        return response()->json(['success'=>true,'message'=>"Zone hydraulique enregistrée — {$r->zone}",'data'=>$this->fmtHydro($r)], 201);
    }

    private function fmtHydro(ReseauHydraulique $r): array
    {
        return ['id'=>$r->id,'zone'=>$r->zone,'type'=>$r->type,'longueur'=>$r->longueur,'taux_couverture'=>$r->taux_couverture,'statut'=>$r->statut,'created_at'=>$r->created_at?->toISOString()];
    }
}
