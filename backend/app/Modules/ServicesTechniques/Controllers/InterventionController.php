<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\DemandeIntervention;
use App\Modules\ServicesTechniques\Models\BonTravail;
use App\Modules\ServicesTechniques\Models\Equipe;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InterventionController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  DEMANDES CITOYENNES
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/interventions/demandes */
    public function indexDemandes(Request $request)
    {
        $query = DemandeIntervention::query()
            ->orderByRaw("FIELD(priorite,'urgente','haute','normale')")
            ->orderByDesc('date_depot');

        if ($s = $request->get('statut'))       $query->where('statut', $s);
        if ($t = $request->get('type_service')) $query->where('type_service', $t);
        if ($p = $request->get('priorite'))     $query->where('priorite', $p);

        $data = $query->paginate((int)$request->get('per_page', 20));
        return response()->json([
            'data'  => $data->map(fn($d) => $this->fmtDemande($d)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/interventions/demandes */
    public function storeDemande(Request $request)
    {
        $v = $request->validate([
            'type_service' => 'required|string|max:50',
            'description'  => 'required|string|max:500',
            'localisation' => 'required|string|max:250',
            'demandeur'    => 'required|string|max:200',
            'telephone'    => 'nullable|string|max:20',
            'priorite'     => 'nullable|in:normale,haute,urgente',
        ]);

        $seq = str_pad(DemandeIntervention::count() + 1, 6, '0', STR_PAD_LEFT);
        $d = DemandeIntervention::create(array_merge($v, [
            'reference'  => 'DI-' . date('Y') . '-' . $seq,
            'statut'     => 'ouverte',
            'priorite'   => $v['priorite'] ?? 'normale',
            'date_depot' => now()->format('Y-m-d'),
        ]));

        return response()->json(['success'=>true,'message'=>"Demande enregistrée — {$d->reference}",'data'=>$this->fmtDemande($d)], 201);
    }

    /** PATCH /api/st/interventions/demandes/{id}/assigner */
    public function assignerDemande(Request $request, $id)
    {
        $d = DemandeIntervention::findOrFail($id);
        $request->validate(['assigne_a' => 'required|string|max:200']);
        $d->update([
            'assigne_a'        => $request->assigne_a,
            'statut'           => 'assignee',
            'date_assignation' => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Demande assignée à {$d->assigne_a}",'data'=>$this->fmtDemande($d->fresh())]);
    }

    /** PATCH /api/st/interventions/demandes/{id}/cloturer */
    public function cloturerDemande($id)
    {
        $d = DemandeIntervention::findOrFail($id);
        $d->update(['statut' => 'cloturee', 'date_resolution' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Demande clôturée — {$d->reference}",'data'=>$this->fmtDemande($d->fresh())]);
    }

    private function fmtDemande(DemandeIntervention $d): array
    {
        return [
            'id' => $d->id, 'reference' => $d->reference, 'type_service' => $d->type_service,
            'description' => $d->description, 'localisation' => $d->localisation,
            'demandeur' => $d->demandeur, 'telephone' => $d->telephone,
            'date_depot' => $d->date_depot?->format('Y-m-d'), 'priorite' => $d->priorite,
            'statut' => $d->statut, 'assigne_a' => $d->assigne_a,
            'date_assignation' => $d->date_assignation?->format('Y-m-d'),
            'date_resolution' => $d->date_resolution?->format('Y-m-d'),
            'created_at' => $d->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  BONS DE TRAVAUX
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/interventions/bons */
    public function indexBons(Request $request)
    {
        $query = BonTravail::query()->orderByDesc('date_debut');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($b) => $this->fmtBon($b)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/interventions/bons */
    public function storeBon(Request $request)
    {
        $v = $request->validate([
            'demande_ref' => 'nullable|string|max:30',
            'description' => 'required|string|max:500',
            'service'     => 'required|string|max:100',
            'equipe'      => 'required|string|max:200',
            'chef'        => 'required|string|max:200',
            'date_debut'  => 'required|date',
            'materiaux'   => 'nullable|string|max:400',
        ]);

        $seq = str_pad(BonTravail::count() + 1, 6, '0', STR_PAD_LEFT);
        $b = BonTravail::create(array_merge($v, [
            'reference' => 'BT-' . date('Y') . '-' . $seq,
            'statut'    => 'planifie',
        ]));

        // Mettre à jour la demande liée si référencée
        if (!empty($v['demande_ref'])) {
            DemandeIntervention::where('reference', $v['demande_ref'])
                ->where('statut', 'assignee')
                ->update(['statut' => 'en_cours']);
        }

        return response()->json(['success'=>true,'message'=>"Bon de travail émis — {$b->reference}",'data'=>$this->fmtBon($b)], 201);
    }

    /** PATCH /api/st/interventions/bons/{id}/terminer */
    public function terminerBon($id)
    {
        $b = BonTravail::findOrFail($id);
        $b->update(['statut' => 'termine', 'date_fin' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Bon terminé — {$b->reference}",'data'=>$this->fmtBon($b->fresh())]);
    }

    private function fmtBon(BonTravail $b): array
    {
        return [
            'id' => $b->id, 'reference' => $b->reference, 'demande_ref' => $b->demande_ref,
            'description' => $b->description, 'service' => $b->service,
            'equipe' => $b->equipe, 'chef' => $b->chef,
            'date_debut' => $b->date_debut?->format('Y-m-d'), 'date_fin' => $b->date_fin?->format('Y-m-d'),
            'materiaux' => $b->materiaux, 'statut' => $b->statut,
            'created_at' => $b->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ÉQUIPES TERRAIN
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/interventions/equipes */
    public function indexEquipes()
    {
        $data = Equipe::query()->orderBy('nom')->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($e) => $this->fmtEquipe($e)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/interventions/equipes */
    public function storeEquipe(Request $request)
    {
        $v = $request->validate([
            'nom'     => 'required|string|max:200',
            'chef'    => 'required|string|max:200',
            'membres' => 'required|integer|min:1',
        ]);
        $e = Equipe::create(array_merge($v, ['statut' => 'disponible']));
        return response()->json(['success'=>true,'message'=>"Équipe enregistrée — {$e->nom}",'data'=>$this->fmtEquipe($e)], 201);
    }

    private function fmtEquipe(Equipe $e): array
    {
        return [
            'id' => $e->id, 'nom' => $e->nom, 'chef' => $e->chef, 'membres' => $e->membres,
            'bon_en_cours' => $e->bon_en_cours, 'localisation' => $e->localisation,
            'statut' => $e->statut, 'created_at' => $e->created_at?->toISOString(),
        ];
    }
}
