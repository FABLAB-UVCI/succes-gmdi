<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\RouteVoirie;
use App\Modules\ServicesTechniques\Models\EntretienVoirie;
use App\Modules\ServicesTechniques\Models\ReparationVoirie;
use Illuminate\Http\Request;

class VoirieController extends Controller
{
    // ── Helpers communs ───────────────────────────────────────────────────────
    private function meta($p): array
    {
        return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()];
    }
    private function links($p): array
    {
        return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ROUTES
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/voirie/routes */
    public function indexRoutes(Request $request)
    {
        $query = RouteVoirie::query()->orderBy('nom');
        if ($s = $request->get('search')) {
            $query->where(function($q) use ($s) { $q->where('nom','like',"%$s%")->orWhere('quartier','like',"%$s%"); });
        }
        if ($e = $request->get('etat')) $query->where('etat', $e);
        $data = $query->paginate((int)$request->get('per_page', 20));
        return response()->json([
            'data'  => $data->map(fn($r) => $this->fmtRoute($r)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/voirie/routes */
    public function storeRoute(Request $request)
    {
        $v = $request->validate([
            'nom'      => 'required|string|max:200',
            'quartier' => 'required|string|max:150',
            'longueur' => 'required|numeric|min:1',
            'type'     => 'required|in:bitumee,laterite,piste',
            'etat'     => 'nullable|in:bon,moyen,degrade,critique',
        ]);
        $route = RouteVoirie::create(array_merge($v, ['etat' => $v['etat'] ?? 'bon']));
        return response()->json(['success'=>true,'message'=>"Route enregistrée — {$route->nom}",'data'=>$this->fmtRoute($route)], 201);
    }

    /** PUT /api/st/voirie/routes/{id} */
    public function updateRoute(Request $request, $id)
    {
        $route = RouteVoirie::findOrFail($id);
        $route->update($request->validate([
            'nom'      => 'sometimes|string|max:200',
            'etat'     => 'sometimes|in:bon,moyen,degrade,critique',
            'longueur' => 'sometimes|numeric|min:1',
        ]));
        return response()->json(['success'=>true,'message'=>'Route mise à jour.','data'=>$this->fmtRoute($route->fresh())]);
    }

    private function fmtRoute(RouteVoirie $r): array
    {
        return [
            'id' => $r->id, 'nom' => $r->nom, 'quartier' => $r->quartier,
            'longueur' => $r->longueur, 'type' => $r->type, 'etat' => $r->etat,
            'date_dernier_entretien' => $r->date_dernier_entretien?->format('Y-m-d'),
            'created_at' => $r->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ENTRETIENS VOIRIE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/voirie/entretiens */
    public function indexEntretiens(Request $request)
    {
        $query = EntretienVoirie::query()->orderByDesc('date_debut');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($e) => $this->fmtEntretien($e)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/voirie/entretiens */
    public function storeEntretien(Request $request)
    {
        $v = $request->validate([
            'route'          => 'required|string|max:200',
            'type_entretien' => 'required|string|max:150',
            'date_debut'     => 'required|date',
            'date_fin'       => 'nullable|date|after_or_equal:date_debut',
            'equipe'         => 'required|string|max:200',
            'cout_estime'    => 'nullable|numeric|min:0',
        ]);
        $e = EntretienVoirie::create(array_merge($v, ['statut' => 'planifie']));
        return response()->json(['success'=>true,'message'=>"Entretien planifié — {$e->route}",'data'=>$this->fmtEntretien($e)], 201);
    }

    /** PATCH /api/st/voirie/entretiens/{id}/terminer */
    public function terminerEntretien($id)
    {
        $e = EntretienVoirie::findOrFail($id);
        $e->update(['statut' => 'termine', 'date_fin' => now()->format('Y-m-d')]);
        // Mettre à jour la date d'entretien sur la route correspondante
        RouteVoirie::where('nom', $e->route)->update(['date_dernier_entretien' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Entretien terminé — {$e->route}",'data'=>$this->fmtEntretien($e->fresh())]);
    }

    private function fmtEntretien(EntretienVoirie $e): array
    {
        return [
            'id' => $e->id, 'route' => $e->route, 'type_entretien' => $e->type_entretien,
            'date_debut' => $e->date_debut?->format('Y-m-d'), 'date_fin' => $e->date_fin?->format('Y-m-d'),
            'equipe' => $e->equipe, 'cout_estime' => $e->cout_estime, 'cout_reel' => $e->cout_reel,
            'statut' => $e->statut, 'created_at' => $e->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  RÉPARATIONS VOIRIE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/voirie/reparations */
    public function indexReparations(Request $request)
    {
        $query = ReparationVoirie::query()
            ->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 ELSE 4 END")
            ->orderByDesc('date_signalement');
        if ($s = $request->get('statut'))   $query->where('statut', $s);
        if ($p = $request->get('priorite')) $query->where('priorite', $p);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($r) => $this->fmtRep($r)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/voirie/reparations */
    public function storeReparation(Request $request)
    {
        $v = $request->validate([
            'route'       => 'required|string|max:200',
            'description' => 'required|string|max:500',
            'priorite'    => 'nullable|in:normale,haute,urgente',
            'signale_par' => 'required|string|max:200',
        ]);
        $r = ReparationVoirie::create(array_merge($v, [
            'statut'           => 'signalee',
            'priorite'         => $v['priorite'] ?? 'normale',
            'date_signalement' => now()->format('Y-m-d'),
        ]));
        return response()->json(['success'=>true,'message'=>"Réparation signalée — {$r->route}",'data'=>$this->fmtRep($r)], 201);
    }

    /** PATCH /api/st/voirie/reparations/{id}/intervenir */
    public function intervenirReparation($id)
    {
        $r = ReparationVoirie::findOrFail($id);
        $r->update(['statut' => 'en_intervention', 'date_intervention' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Intervention démarrée — {$r->route}",'data'=>$this->fmtRep($r->fresh())]);
    }

    private function fmtRep(ReparationVoirie $r): array
    {
        return [
            'id' => $r->id, 'route' => $r->route, 'description' => $r->description,
            'priorite' => $r->priorite, 'signale_par' => $r->signale_par,
            'date_signalement' => $r->date_signalement?->format('Y-m-d'),
            'date_intervention' => $r->date_intervention?->format('Y-m-d'),
            'statut' => $r->statut, 'created_at' => $r->created_at?->toISOString(),
        ];
    }
}
