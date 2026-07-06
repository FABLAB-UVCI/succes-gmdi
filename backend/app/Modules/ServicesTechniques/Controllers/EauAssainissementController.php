<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\Caniveau;
use App\Modules\ServicesTechniques\Models\InterventionDrainage;
use App\Modules\ServicesTechniques\Models\CollecteDechet;
use Illuminate\Http\Request;

class EauAssainissementController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  CANIVEAUX
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eau/caniveaux */
    public function indexCaniveaux(Request $request)
    {
        $query = Caniveau::query()->orderBy('quartier')->orderBy('localisation');
        if ($e = $request->get('etat')) $query->where('etat', $e);
        $data = $query->paginate(25);
        return response()->json([
            'data'  => $data->map(fn($c) => $this->fmtCan($c)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eau/caniveaux */
    public function storeCaniveau(Request $request)
    {
        $v = $request->validate([
            'localisation' => 'required|string|max:200',
            'quartier'     => 'required|string|max:150',
            'longueur'     => 'required|numeric|min:1',
            'etat'         => 'nullable|in:bon,colmate,degrade',
        ]);
        $c = Caniveau::create(array_merge($v, ['etat' => $v['etat'] ?? 'bon']));
        return response()->json(['success'=>true,'message'=>"Caniveau enregistré — {$c->localisation}",'data'=>$this->fmtCan($c)], 201);
    }

    /** PATCH /api/st/eau/caniveaux/{id}/nettoyage */
    public function nettoyageCaniveau($id)
    {
        $c = Caniveau::findOrFail($id);
        $c->update(['etat' => 'bon', 'date_dernier_nettoyage' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Nettoyage enregistré — {$c->localisation}",'data'=>$this->fmtCan($c->fresh())]);
    }

    private function fmtCan(Caniveau $c): array
    {
        return [
            'id' => $c->id, 'localisation' => $c->localisation, 'quartier' => $c->quartier,
            'longueur' => $c->longueur, 'etat' => $c->etat,
            'date_dernier_nettoyage' => $c->date_dernier_nettoyage?->format('Y-m-d'),
            'created_at' => $c->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DRAINAGE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eau/drainage */
    public function indexDrainage(Request $request)
    {
        $query = InterventionDrainage::query()->orderByDesc('date_intervention');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($d) => $this->fmtDrain($d)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eau/drainage */
    public function storeDrainage(Request $request)
    {
        $v = $request->validate([
            'localisation'     => 'required|string|max:200',
            'type'             => 'required|in:curage,debouchage,reparation,construction',
            'date_intervention'=> 'required|date',
            'equipe'           => 'required|string|max:200',
            'observations'     => 'nullable|string|max:400',
        ]);
        $d = InterventionDrainage::create(array_merge($v, ['statut' => 'planifie']));
        return response()->json(['success'=>true,'message'=>"Intervention drainage enregistrée — {$d->localisation}",'data'=>$this->fmtDrain($d)], 201);
    }

    private function fmtDrain(InterventionDrainage $d): array
    {
        return [
            'id' => $d->id, 'localisation' => $d->localisation, 'type' => $d->type,
            'date_intervention' => $d->date_intervention?->format('Y-m-d'), 'equipe' => $d->equipe,
            'statut' => $d->statut, 'observations' => $d->observations,
            'created_at' => $d->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  DÉCHETS
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eau/dechets */
    public function indexDechets(Request $request)
    {
        $data = CollecteDechet::query()->orderBy('prochaine_collecte')->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($c) => $this->fmtDechet($c)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eau/dechets */
    public function storeDechet(Request $request)
    {
        $v = $request->validate([
            'zone'               => 'required|string|max:200',
            'frequence'          => 'required|string|max:50',
            'prochaine_collecte' => 'required|date',
        ]);
        $c = CollecteDechet::create(array_merge($v, ['statut' => 'planifie']));
        return response()->json(['success'=>true,'message'=>"Collecte planifiée — {$c->zone}",'data'=>$this->fmtDechet($c)], 201);
    }

    /** PATCH /api/st/eau/dechets/{id}/effectuer */
    public function effectuerCollecte(Request $request, $id)
    {
        $c = CollecteDechet::findOrFail($id);
        $c->update([
            'statut'  => 'effectue',
            'tonnage' => $request->get('tonnage'),
        ]);
        return response()->json(['success'=>true,'message'=>"Collecte effectuée — {$c->zone}",'data'=>$this->fmtDechet($c->fresh())]);
    }

    private function fmtDechet(CollecteDechet $c): array
    {
        return [
            'id' => $c->id, 'zone' => $c->zone, 'frequence' => $c->frequence,
            'prochaine_collecte' => $c->prochaine_collecte?->format('Y-m-d'),
            'tonnage' => $c->tonnage, 'statut' => $c->statut,
            'created_at' => $c->created_at?->toISOString(),
        ];
    }
}
