<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\Parcelle;
use App\Modules\Urbanisme\Models\Lot;
use App\Modules\Urbanisme\Models\TitreFoncier;
use App\Modules\Urbanisme\Models\ReserveAdministrative;
use Illuminate\Http\Request;

class FoncierController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  PARCELLES
    // ═══════════════════════════════════════════════════════════════════════

    public function indexParcelles(Request $request)
    {
        $q = Parcelle::query()->orderByDesc('created_at');
        if ($s = $request->get('statut'))   $q->where('statut', $s);
        if ($qr= $request->get('quartier')) $q->where('quartier', $qr);
        if ($sr= $request->get('search'))   $q->where(fn($x) => $x->where('proprietaire','like',"%$sr%")->orWhere('reference','like',"%$sr%")->orWhere('localisation','like',"%$sr%"));
        $data = $q->paginate((int)$request->get('per_page', 20));
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmtPar($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeParcelle(Request $request)
    {
        $v = $request->validate([
            'proprietaire'  => 'required|string|max:200',
            'localisation'  => 'required|string|max:250',
            'quartier'      => 'required|string|max:150',
            'superficie'    => 'required|numeric|min:1',
            'usage'         => 'nullable|string|max:100',
            'titre_foncier' => 'nullable|string|max:50',
            'statut'        => 'nullable|in:libre,occupe,litige,reserve',
            'lat'           => 'nullable|numeric',
            'lng'           => 'nullable|numeric',
        ]);
        $seq = str_pad(Parcelle::count() + 1, 4, '0', STR_PAD_LEFT);
        $par = Parcelle::create(array_merge($v, [
            'reference' => 'URB-PAR-' . date('Y') . '-' . $seq,
            'statut'    => $v['statut'] ?? 'libre',
        ]));
        return response()->json(['success'=>true,'message'=>"Parcelle enregistrée — {$par->reference}",'data'=>$this->fmtPar($par)], 201);
    }

    public function showParcelle($id) { return response()->json(['success'=>true,'message'=>'OK','data'=>$this->fmtPar(Parcelle::findOrFail($id))]); }

    public function updateParcelle(Request $request, $id)
    {
        $p = Parcelle::findOrFail($id);
        $p->update($request->validate(['proprietaire'=>'sometimes|string|max:200','localisation'=>'sometimes|string|max:250','superficie'=>'sometimes|numeric','titre_foncier'=>'nullable|string','usage'=>'nullable|string']));
        return response()->json(['success'=>true,'message'=>'Parcelle mise à jour.','data'=>$this->fmtPar($p->fresh())]);
    }

    public function updateStatutParcelle(Request $request, $id)
    {
        $p = Parcelle::findOrFail($id);
        $request->validate(['statut'=>'required|in:libre,occupe,litige,reserve']);
        $p->update(['statut'=>$request->statut]);
        return response()->json(['success'=>true,'message'=>"Statut mis à jour : {$p->statut}",'data'=>$this->fmtPar($p->fresh())]);
    }

    private function fmtPar(Parcelle $p): array
    {
        return ['id'=>$p->id,'reference'=>$p->reference,'proprietaire'=>$p->proprietaire,'localisation'=>$p->localisation,'quartier'=>$p->quartier,'superficie'=>$p->superficie,'usage'=>$p->usage,'titre_foncier'=>$p->titre_foncier,'statut'=>$p->statut,'coordonnees'=>$p->lat ? ['lat'=>$p->lat,'lng'=>$p->lng] : null,'created_at'=>$p->created_at?->toISOString()];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  LOTS
    // ═══════════════════════════════════════════════════════════════════════

    public function indexLots(Request $request)
    {
        $q = Lot::query()->orderBy('lotissement')->orderBy('reference');
        if ($l = $request->get('lotissement')) $q->where('lotissement', $l);
        if ($s = $request->get('statut'))       $q->where('statut', $s);
        $data = $q->paginate(30);
        return response()->json(['data'=>$data->map(fn($l)=>$this->fmtLot($l)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeLot(Request $request)
    {
        $v = $request->validate([
            'lotissement'      => 'required|string|max:200',
            'numero'           => 'nullable|integer|min:1',
            'superficie'       => 'required|numeric|min:1',
            'usage'            => 'nullable|string|max:100',
            'prix'             => 'nullable|numeric|min:0',
            'attribue_a'       => 'nullable|string|max:200',
            'attributaire'     => 'nullable|string|max:200',
            'date_attribution' => 'nullable|date',
            'reference'        => 'nullable|string|max:30',
        ]);

        // Normaliser les champs
        $attributaire = $v['attribue_a'] ?? $v['attributaire'] ?? null;
        $reference    = $v['reference'] ?? ('L-' . strtoupper(substr(preg_replace('/\s+/','-',$v['lotissement']),0,6)) . '-' . str_pad(Lot::count()+1,3,'0',STR_PAD_LEFT));

        $lot = Lot::create([
            'reference'        => $reference,
            'lotissement'      => $v['lotissement'],
            'numero'           => $v['numero'] ?? null,
            'superficie'       => $v['superficie'],
            'usage'            => $v['usage'] ?? null,
            'prix'             => $v['prix'] ?? null,
            'attributaire'     => $attributaire,
            'attribue_a'       => $v['attribue_a'] ?? null,
            'date_attribution' => $v['date_attribution'] ?? null,
            'statut'           => $attributaire ? 'attribue' : 'disponible',
        ]);
        return response()->json(['success'=>true,'message'=>"Lot enregistré — {$lot->reference}",'data'=>$this->fmtLot($lot)], 201);
    }

    public function updateLot(Request $request, $id)
    {
        $l = Lot::findOrFail($id);
        $l->update($request->validate(['attributaire'=>'nullable|string|max:200','date_attribution'=>'nullable|date','statut'=>'sometimes|in:disponible,attribue,construit','usage'=>'nullable|string|max:100','prix'=>'nullable|numeric']));
        return response()->json(['success'=>true,'message'=>'Lot mis à jour.','data'=>$this->fmtLot($l->fresh())]);
    }

    public function attribuerLot(Request $request, $id)
    {
        $l = Lot::findOrFail($id);
        $request->validate(['attribue_a'=>'required|string|max:200']);
        $l->update([
            'attributaire'     => $request->attribue_a,
            'attribue_a'       => $request->attribue_a,
            'date_attribution' => now()->format('Y-m-d'),
            'statut'           => 'attribue',
        ]);
        return response()->json(['success'=>true,'message'=>"Lot attribué à {$request->attribue_a}",'data'=>$this->fmtLot($l->fresh())]);
    }

    private function fmtLot(Lot $l): array
    {
        return ['id'=>$l->id,'reference'=>$l->reference,'lotissement'=>$l->lotissement,'numero'=>$l->numero,'superficie'=>$l->superficie,'usage'=>$l->usage,'prix'=>$l->prix,'attribue_a'=>$l->attribue_a ?? $l->attributaire,'attributaire'=>$l->attributaire,'date_attribution'=>$l->date_attribution?->format('Y-m-d'),'statut'=>$l->statut,'created_at'=>$l->created_at?->toISOString()];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  TITRES FONCIERS
    // ═══════════════════════════════════════════════════════════════════════

    public function indexTitres(Request $request)
    {
        $q = TitreFoncier::query()->orderByDesc('date_delivrance');
        if ($t = $request->get('type'))   $q->where('type', $t);
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($t)=>$this->fmtTF($t)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeTitre(Request $request)
    {
        $v = $request->validate([
            'proprietaire'    => 'required|string|max:200',
            'parcelle'        => 'nullable|string|max:250',
            'localisation'    => 'nullable|string|max:250',
            'superficie'      => 'required|numeric|min:1',
            'date_delivrance' => 'nullable|date',
            'date_expiration' => 'nullable|date',
            'observation'     => 'nullable|string|max:500',
            'numero'          => 'nullable|string|max:60',
            'lat'             => 'nullable|numeric',
            'lng'             => 'nullable|numeric',
            'type'            => 'nullable|in:TF,ACD,CU,autre',
        ]);

        // Normaliser
        $localisation = $v['localisation'] ?? $v['parcelle'] ?? 'Non précisé';
        $numero       = $v['numero'] ?? ('TF-' . date('Y') . '-' . str_pad(TitreFoncier::count()+1,4,'0',STR_PAD_LEFT));
        $type         = $v['type'] ?? 'TF';

        // Éviter doublon de numéro
        if (TitreFoncier::where('numero', $numero)->exists()) {
            $numero .= '-' . rand(100,999);
        }

        $tf = TitreFoncier::create([
            'numero'          => $numero,
            'type'            => $type,
            'proprietaire'    => $v['proprietaire'],
            'superficie'      => $v['superficie'],
            'localisation'    => $localisation,
            'date_delivrance' => $v['date_delivrance'] ?? now()->format('Y-m-d'),
            'date_expiration' => $v['date_expiration'] ?? null,
            'observation'     => $v['observation'] ?? null,
            'statut'          => 'valide',
            'lat'             => $v['lat'] ?? null,
            'lng'             => $v['lng'] ?? null,
        ]);
        return response()->json(['success'=>true,'message'=>"Titre enregistré — {$tf->numero}",'data'=>$this->fmtTF($tf)], 201);
    }

    public function updateTitre(Request $request, $id)
    {
        $t = TitreFoncier::findOrFail($id);
        $t->update($request->validate(['proprietaire'=>'sometimes|string|max:200','statut'=>'sometimes|in:valide,expire,litige,en_cours']));
        return response()->json(['success'=>true,'message'=>'Titre mis à jour.','data'=>$this->fmtTF($t->fresh())]);
    }

    private function fmtTF(TitreFoncier $t): array
    {
        return ['id'=>$t->id,'numero'=>$t->numero,'type'=>$t->type,'proprietaire'=>$t->proprietaire,'parcelle'=>$t->localisation,'superficie'=>$t->superficie,'localisation'=>$t->localisation,'date_delivrance'=>$t->date_delivrance?->format('Y-m-d'),'date_expiration'=>$t->date_expiration?->format('Y-m-d'),'statut'=>$t->statut,'observation'=>$t->observation ?? null,'lat'=>$t->lat ?? null,'lng'=>$t->lng ?? null,'created_at'=>$t->created_at?->toISOString()];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  RÉSERVES ADMINISTRATIVES
    // ═══════════════════════════════════════════════════════════════════════

    public function indexReserves(Request $request)
    {
        $q = ReserveAdministrative::query()->orderBy('denomination');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($r)=>$this->fmtRes($r)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeReserve(Request $request)
    {
        $v = $request->validate([
            'designation'    => 'nullable|string|max:200',
            'denomination'   => 'nullable|string|max:200',
            'usage'          => 'required|string|max:200',
            'superficie'     => 'required|numeric|min:1',
            'localisation'   => 'required|string|max:250',
            'administration' => 'nullable|string|max:150',
            'lat'            => 'nullable|numeric',
            'lng'            => 'nullable|numeric',
        ]);

        $denomination = $v['denomination'] ?? $v['designation'] ?? 'Réserve sans nom';

        $r = ReserveAdministrative::create([
            'denomination'   => $denomination,
            'usage'          => $v['usage'],
            'superficie'     => $v['superficie'],
            'localisation'   => $v['localisation'],
            'administration' => $v['administration'] ?? null,
            'statut'         => 'reserve',
            'lat'            => $v['lat'] ?? null,
            'lng'            => $v['lng'] ?? null,
        ]);
        return response()->json(['success'=>true,'message'=>"Réserve enregistrée — {$r->denomination}",'data'=>$this->fmtRes($r)], 201);
    }

    public function updateReserve(Request $request, $id)
    {
        $r = ReserveAdministrative::findOrFail($id);
        $r->update($request->validate(['usage'=>'sometimes|string|max:200','statut'=>'sometimes|in:reserve,affecte,libere','administration'=>'nullable|string|max:150']));
        return response()->json(['success'=>true,'message'=>'Réserve mise à jour.','data'=>$this->fmtRes($r->fresh())]);
    }

    private function fmtRes(ReserveAdministrative $r): array
    {
        return ['id'=>$r->id,'denomination'=>$r->denomination,'designation'=>$r->denomination,'usage'=>$r->usage,'superficie'=>$r->superficie,'localisation'=>$r->localisation,'statut'=>$r->statut,'administration'=>$r->administration,'lat'=>$r->lat ?? null,'lng'=>$r->lng ?? null,'created_at'=>$r->created_at?->toISOString()];
    }
}
