<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\Permis;
use Illuminate\Http\Request;

class PermisController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    private function nextRef(string $type): string
    {
        $codes = ['construire'=>'PC','demolir'=>'PD','certificat'=>'CU','occupation'=>'AO'];
        $code  = $codes[$type] ?? 'PE';
        $seq   = str_pad(Permis::where('type', $type)->count() + 1, 6, '0', STR_PAD_LEFT);
        return "{$code}-" . date('Y') . "-{$seq}";
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  LISTE GÉNÉRALE
    // ═══════════════════════════════════════════════════════════════════════

    public function index(Request $request)
    {
        $q = Permis::query()->orderByDesc('date_depot');
        if ($t  = $request->get('type'))    $q->where('type', $t);
        if ($s  = $request->get('statut'))  $q->where('statut', $s);
        if ($qr = $request->get('quartier'))$q->where('quartier', $qr);
        if ($m  = $request->get('mois'))    $q->whereMonth('date_depot', $m)->whereYear('date_depot', now()->year);
        $data = $q->paginate((int)$request->get('per_page', 20));
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmt($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function show($id)
    {
        return response()->json(['success'=>true,'message'=>'OK','data'=>$this->fmt(Permis::findOrFail($id))]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'type'            => 'required|in:construire,demolir,certificat,occupation',
            'demandeur'       => 'required|string|max:200',
            'telephone'       => 'nullable|string|max:20',
            'localisation'    => 'nullable|string|max:250',
            'quartier'        => 'nullable|string|max:150',
            'ilot'            => 'nullable|string|max:50',
            'lot'             => 'nullable|string|max:50',
            'section'         => 'nullable|string|max:50',
            'numero_piece'    => 'nullable|string|max:100',
            'type_piece'      => 'nullable|in:cni,passeport,sejour,autre',
            'surface_plancher'=> 'nullable|numeric|min:0',
            'lat'             => 'nullable|numeric',
            'lng'             => 'nullable|numeric',
            'agent'           => 'nullable|string|max:200',
            'observations'    => 'nullable|string|max:500',
        ]);
        $permis = Permis::create(array_merge($v, [
            'reference'   => $this->nextRef($v['type']),
            'statut'      => 'depose',
            'date_depot'  => now()->format('Y-m-d'),
            'localisation'=> $v['localisation'] ?? 'Non précisée',
            'quartier'    => $v['quartier'] ?? 'Non précisé',
        ]));
        return response()->json(['success'=>true,'message'=>"Demande enregistrée — {$permis->reference}",'data'=>$this->fmt($permis)], 201);
    }

    public function update(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $p->update($request->validate(['agent'=>'nullable|string|max:200','observations'=>'nullable|string|max:500','surface_plancher'=>'nullable|numeric']));
        return response()->json(['success'=>true,'message'=>'Permis mis à jour.','data'=>$this->fmt($p->fresh())]);
    }

    public function updateStatut(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $request->validate(['statut'=>'required|in:instruction,accorde,refuse,expire']);
        $updates = ['statut' => $request->statut];
        if ($request->statut === 'instruction') $updates['date_instruction'] = now()->format('Y-m-d');
        if (in_array($request->statut, ['accorde','refuse'])) {
            $updates['date_decision'] = now()->format('Y-m-d');
            if ($request->statut === 'accorde') $updates['date_expiration'] = now()->addYears(2)->format('Y-m-d');
        }
        $p->update($updates);
        return response()->json(['success'=>true,'message'=>"Statut → {$request->statut}",'data'=>$this->fmt($p->fresh())]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PERMIS DE CONSTRUIRE
    // ═══════════════════════════════════════════════════════════════════════

    public function indexConstruit(Request $request)
    {
        $q = Permis::where('type', 'construire')->orderByDesc('date_depot');
        if ($s = $request->get('statut')) {
            // Mapper les statuts frontend → DB
            $map = ['en_attente'=>'depose','instruit'=>'instruction'];
            $q->where('statut', $map[$s] ?? $s);
        }
        $data = $q->paginate((int)$request->get('per_page', 20));
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmt($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeConstruit(Request $request)
    {
        $v = $request->validate([
            'demandeur'       => 'required|string|max:200',
            'telephone'       => 'nullable|string|max:20',
            'adresse_travaux' => 'required|string|max:250',
            'quartier'        => 'nullable|string|max:150',
            'type_construire' => 'nullable|string|max:100',
            'nombre_etages'   => 'nullable|integer|min:0',
            'superficie'      => 'nullable|numeric|min:0',
            'cout_estime'     => 'nullable|numeric|min:0',
            'observations'    => 'nullable|string|max:500',
        ]);

        $permis = Permis::create([
            'reference'       => $this->nextRef('construire'),
            'type'            => 'construire',
            'demandeur'       => $v['demandeur'],
            'telephone'       => $v['telephone'] ?? null,
            'localisation'    => $v['adresse_travaux'],
            'quartier'        => $v['quartier'] ?? 'Non précisé',
            'surface_plancher'=> $v['superficie'] ?? null,
            'nombre_etages'   => $v['nombre_etages'] ?? null,
            'cout_estime'     => $v['cout_estime'] ?? null,
            'observations'    => isset($v['type_construire']) ? "Type : {$v['type_construire']}" . (isset($v['observations']) ? " — {$v['observations']}" : '') : ($v['observations'] ?? null),
            'statut'          => 'depose',
            'date_depot'      => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Demande de permis de construire enregistrée — {$permis->reference}",'data'=>$this->fmt($permis)], 201);
    }

    public function instruire(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $request->validate(['instructeur'=>'required|string|max:200']);
        $p->update([
            'instructeur'      => $request->instructeur,
            'statut'           => 'instruction',
            'date_instruction' => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Dossier en instruction — {$p->reference}",'data'=>$this->fmt($p->fresh())]);
    }

    public function decider(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $request->validate(['statut'=>'required|in:accorde,refuse','motif_refus'=>'nullable|string|max:500']);
        $updates = [
            'statut'        => $request->statut,
            'date_decision' => now()->format('Y-m-d'),
            'motif_refus'   => $request->motif_refus ?? null,
        ];
        if ($request->statut === 'accorde') $updates['date_expiration'] = now()->addYears(2)->format('Y-m-d');
        $p->update($updates);
        return response()->json(['success'=>true,'message'=>"Décision : {$request->statut}",'data'=>$this->fmt($p->fresh())]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PERMIS DE DÉMOLIR
    // ═══════════════════════════════════════════════════════════════════════

    public function indexDemolir(Request $request)
    {
        $q = Permis::where('type', 'demolir')->orderByDesc('date_depot');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmt($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeDemolir(Request $request)
    {
        $v = $request->validate([
            'demandeur'            => 'required|string|max:200',
            'adresse_travaux'      => 'required|string|max:250',
            'description_batiment' => 'nullable|string|max:500',
            'quartier'             => 'nullable|string|max:150',
        ]);
        $permis = Permis::create([
            'reference'    => $this->nextRef('demolir'),
            'type'         => 'demolir',
            'demandeur'    => $v['demandeur'],
            'localisation' => $v['adresse_travaux'],
            'quartier'     => $v['quartier'] ?? 'Non précisé',
            'observations' => $v['description_batiment'] ?? null,
            'statut'       => 'depose',
            'date_depot'   => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Permis de démolir enregistré — {$permis->reference}",'data'=>$this->fmt($permis)], 201);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  CERTIFICATS D'URBANISME
    // ═══════════════════════════════════════════════════════════════════════

    public function indexCertificat(Request $request)
    {
        $q = Permis::where('type', 'certificat')->orderByDesc('date_depot');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmt($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeCertificat(Request $request)
    {
        $v = $request->validate([
            'demandeur' => 'required|string|max:200',
            'adresse'   => 'required|string|max:250',
            'type'      => 'nullable|string|max:100',
            'quartier'  => 'nullable|string|max:150',
        ]);
        $permis = Permis::create([
            'reference'    => $this->nextRef('certificat'),
            'type'         => 'certificat',
            'demandeur'    => $v['demandeur'],
            'localisation' => $v['adresse'],
            'quartier'     => $v['quartier'] ?? 'Non précisé',
            'observations' => $v['type'] ?? null,
            'statut'       => 'depose',
            'date_depot'   => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Certificat d'urbanisme enregistré — {$permis->reference}",'data'=>$this->fmt($permis)], 201);
    }

    public function delivrer(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $p->update(['statut'=>'accorde','date_decision'=>now()->format('Y-m-d'),'date_expiration'=>now()->addYear()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Certificat délivré — {$p->reference}",'data'=>$this->fmt($p->fresh())]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  AUTORISATIONS D'OCCUPATION
    // ═══════════════════════════════════════════════════════════════════════

    public function indexAutorisation(Request $request)
    {
        $q = Permis::where('type', 'occupation')->orderByDesc('date_depot');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmt($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeAutorisation(Request $request)
    {
        $v = $request->validate([
            'beneficiaire'     => 'required|string|max:200',
            'type_occupation'  => 'nullable|string|max:100',
            'localisation'     => 'required|string|max:250',
            'superficie'       => 'nullable|numeric|min:0',
            'date_debut'       => 'nullable|date',
            'date_fin'         => 'nullable|date',
            'montant_redevance'=> 'nullable|numeric|min:0',
            'quartier'         => 'nullable|string|max:150',
        ]);
        $permis = Permis::create([
            'reference'       => $this->nextRef('occupation'),
            'type'            => 'occupation',
            'demandeur'       => $v['beneficiaire'],
            'localisation'    => $v['localisation'],
            'quartier'        => $v['quartier'] ?? 'Non précisé',
            'surface_plancher'=> $v['superficie'] ?? null,
            'observations'    => implode(' | ', array_filter([
                isset($v['type_occupation']) ? "Occupation : {$v['type_occupation']}" : null,
                isset($v['date_debut'])      ? "Du : {$v['date_debut']}"               : null,
                isset($v['date_fin'])        ? "Au : {$v['date_fin']}"                 : null,
                isset($v['montant_redevance'])? "Redevance : {$v['montant_redevance']} FCFA" : null,
            ])),
            'statut'          => 'depose',
            'date_depot'      => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Autorisation enregistrée — {$permis->reference}",'data'=>$this->fmt($permis)], 201);
    }

    public function resilier(Request $request, $id)
    {
        $p = Permis::findOrFail($id);
        $p->update(['statut'=>'expire','date_decision'=>now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Autorisation résiliée — {$p->reference}",'data'=>$this->fmt($p->fresh())]);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  FORMAT DE SORTIE
    // ═══════════════════════════════════════════════════════════════════════

    private function fmt(Permis $p): array
    {
        return [
            'id'               => $p->id,
            'reference'        => $p->reference,
            'type'             => $p->type,
            'demandeur'        => $p->demandeur,
            'beneficiaire'     => $p->demandeur,
            'telephone'        => $p->telephone,
            'localisation'     => $p->localisation,
            'adresse_travaux'  => $p->localisation,
            'adresse'          => $p->localisation,
            'quartier'         => $p->quartier,
            'surface_plancher' => $p->surface_plancher,
            'superficie'       => $p->surface_plancher,
            'nombre_etages'    => $p->nombre_etages ?? null,
            'cout_estime'      => $p->cout_estime ?? null,
            'instructeur'      => $p->instructeur ?? null,
            'motif_refus'      => $p->motif_refus ?? null,
            'date_depot'       => $p->date_depot?->format('Y-m-d'),
            'date_instruction' => $p->date_instruction?->format('Y-m-d'),
            'date_decision'    => $p->date_decision?->format('Y-m-d'),
            'date_expiration'  => $p->date_expiration?->format('Y-m-d'),
            'statut'           => $p->statut,
            'agent'            => $p->agent,
            'observations'     => $p->observations,
            'created_at'       => $p->created_at?->toISOString(),
        ];
    }
}
