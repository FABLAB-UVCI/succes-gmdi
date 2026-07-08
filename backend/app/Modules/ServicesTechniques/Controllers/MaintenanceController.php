<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\PlanningMaintenance;
use App\Modules\ServicesTechniques\Models\MaintenanceCorrective;
use Illuminate\Http\Request;

class MaintenanceController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  PLANNING PRÉVENTIF
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/maintenance/planning */
    public function indexPlanning(Request $request)
    {
        $query = PlanningMaintenance::query()->orderBy('date_prevue');

        if ($s = $request->get('statut'))  $query->where('statut', $s);
        if ($sv = $request->get('service')) $query->where('service', $sv);

        // Marquer automatiquement les planifications en retard
        PlanningMaintenance::where('date_prevue', '<', now()->format('Y-m-d'))
            ->where('statut', 'programme')
            ->update(['statut' => 'en_retard']);

        $data = $query->paginate(25);
        return response()->json([
            'data'  => $data->map(fn($p) => $this->fmtPlanning($p)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/maintenance/planning */
    public function storePlanning(Request $request)
    {
        $v = $request->validate([
            'equipement'       => 'required|string|max:200',
            'service'          => 'required|string|max:100',
            'type_maintenance' => 'required|string|max:150',
            'date_prevue'      => 'required|date',
            'periodicite'      => 'nullable|in:Mensuelle,Trimestrielle,Semestrielle,Annuelle',
            'responsable'      => 'required|string|max:200',
            'cout_estime'      => 'nullable|numeric|min:0',
        ]);
        $p = PlanningMaintenance::create(array_merge($v, ['statut' => 'programme']));
        return response()->json(['success'=>true,'message'=>"Maintenance planifiée — {$p->equipement}",'data'=>$this->fmtPlanning($p)], 201);
    }

    /** PATCH /api/st/maintenance/planning/{id}/valider */
    public function validerPlanning($id)
    {
        $p = PlanningMaintenance::findOrFail($id);
        $p->update(['statut' => 'effectue', 'date_realisation' => now()->format('Y-m-d')]);
        return response()->json(['success'=>true,'message'=>"Maintenance validée comme effectuée — {$p->equipement}",'data'=>$this->fmtPlanning($p->fresh())]);
    }

    private function fmtPlanning(PlanningMaintenance $p): array
    {
        return [
            'id' => $p->id, 'equipement' => $p->equipement, 'service' => $p->service,
            'type_maintenance' => $p->type_maintenance, 'date_prevue' => $p->date_prevue?->format('Y-m-d'),
            'periodicite' => $p->periodicite ?? 'Trimestrielle', 'responsable' => $p->responsable,
            'cout_estime' => $p->cout_estime, 'statut' => $p->statut,
            'created_at' => $p->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MAINTENANCE CORRECTIVE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/maintenance/corrective */
    public function indexCorrective(Request $request)
    {
        $query = MaintenanceCorrective::query()
            ->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 ELSE 4 END")
            ->orderByDesc('date_signalement');
        if ($s = $request->get('statut'))   $query->where('statut', $s);
        if ($p = $request->get('priorite')) $query->where('priorite', $p);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($c) => $this->fmtCorrective($c)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/maintenance/corrective */
    public function storeCorrective(Request $request)
    {
        $v = $request->validate([
            'equipement' => 'required|string|max:200',
            'service'    => 'required|string|max:100',
            'panne'      => 'required|string|max:400',
            'priorite'   => 'nullable|in:normale,haute,urgente',
        ]);
        $c = MaintenanceCorrective::create(array_merge($v, [
            'statut'           => 'signale',
            'priorite'         => $v['priorite'] ?? 'normale',
            'date_signalement' => now()->format('Y-m-d'),
        ]));
        return response()->json(['success'=>true,'message'=>"Panne signalée — {$c->equipement}",'data'=>$this->fmtCorrective($c)], 201);
    }

    /** PATCH /api/st/maintenance/corrective/{id}/resoudre */
    public function resoudreCorrective(Request $request, $id)
    {
        $c = MaintenanceCorrective::findOrFail($id);
        $c->update([
            'statut'          => 'resolu',
            'date_resolution' => now()->format('Y-m-d'),
            'cout_reel'       => $request->get('cout_reel'),
            'technicien'      => $request->get('technicien', auth()->user()?->name),
        ]);
        return response()->json(['success'=>true,'message'=>"Panne résolue — {$c->equipement}",'data'=>$this->fmtCorrective($c->fresh())]);
    }

    private function fmtCorrective(MaintenanceCorrective $c): array
    {
        return [
            'id' => $c->id, 'equipement' => $c->equipement, 'service' => $c->service,
            'panne' => $c->panne, 'priorite' => $c->priorite, 'technicien' => $c->technicien,
            'date_signalement' => $c->date_signalement?->format('Y-m-d'),
            'date_resolution'  => $c->date_resolution?->format('Y-m-d'),
            'cout_reel' => $c->cout_reel, 'statut' => $c->statut,
            'created_at' => $c->created_at?->toISOString(),
        ];
    }
}
