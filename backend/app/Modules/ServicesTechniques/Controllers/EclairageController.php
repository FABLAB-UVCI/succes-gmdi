<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\Lampadaire;
use App\Modules\ServicesTechniques\Models\PanneEclairage;
use App\Modules\ServicesTechniques\Models\MaintenanceEclairage;
use Illuminate\Http\Request;

class EclairageController extends Controller
{
    // ── Helpers ───────────────────────────────────────────────────────────────
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  LAMPADAIRES
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eclairage/lampadaires */
    public function indexLampadaires(Request $request)
    {
        $query = Lampadaire::query()->orderBy('quartier')->orderBy('reference');
        if ($s = $request->get('statut'))   $query->where('statut', $s);
        if ($q = $request->get('quartier')) $query->where('quartier', $q);
        $data = $query->paginate(30);
        return response()->json([
            'data'  => $data->map(fn($l) => $this->fmtLamp($l)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eclairage/lampadaires */
    public function storeLampadaire(Request $request)
    {
        $v = $request->validate([
            'localisation' => 'required|string|max:200',
            'quartier'     => 'required|string|max:150',
            'type_lampe'   => 'required|string|max:100',
            'puissance'    => 'nullable|numeric|min:1',
            'date_posee'   => 'nullable|date',
        ]);
        $seq = str_pad(Lampadaire::count() + 1, 3, '0', STR_PAD_LEFT);
        $l = Lampadaire::create(array_merge($v, [
            'reference' => "ECL-{$seq}",
            'statut'    => 'fonctionnel',
        ]));
        return response()->json(['success'=>true,'message'=>"Lampadaire enregistré — {$l->reference}",'data'=>$this->fmtLamp($l)], 201);
    }

    /** PATCH /api/st/eclairage/lampadaires/{id}/statut */
    public function updateStatutLampadaire(Request $request, $id)
    {
        $l = Lampadaire::findOrFail($id);
        $request->validate(['statut' => 'required|in:fonctionnel,en_panne,en_maintenance']);
        $l->update(['statut' => $request->statut]);
        return response()->json(['success'=>true,'message'=>"Statut mis à jour — {$l->reference}",'data'=>$this->fmtLamp($l->fresh())]);
    }

    private function fmtLamp(Lampadaire $l): array
    {
        return [
            'id' => $l->id, 'reference' => $l->reference, 'localisation' => $l->localisation,
            'quartier' => $l->quartier, 'type_lampe' => $l->type_lampe, 'puissance' => $l->puissance,
            'statut' => $l->statut, 'date_posee' => $l->date_posee?->format('Y-m-d'),
            'date_dernier_controle' => $l->date_dernier_controle?->format('Y-m-d'),
            'created_at' => $l->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  PANNES ÉCLAIRAGE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eclairage/pannes */
    public function indexPannes(Request $request)
    {
        $query = PanneEclairage::query()->orderByDesc('date_signalement');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($p) => $this->fmtPanne($p)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eclairage/pannes */
    public function storePanne(Request $request)
    {
        $v = $request->validate([
            'localisation' => 'required|string|max:200',
            'description'  => 'required|string|max:300',
        ]);
        $seq = str_pad(PanneEclairage::count() + 1, 4, '0', STR_PAD_LEFT);
        $p = PanneEclairage::create(array_merge($v, [
            'reference'        => "PAN-" . date('Y') . "-{$seq}",
            'date_signalement' => now()->format('Y-m-d'),
            'statut'           => 'signalee',
        ]));
        // Mettre le lampadaire correspondant en panne si trouvé
        Lampadaire::where('localisation', 'like', "%{$v['localisation']}%")
            ->where('statut', 'fonctionnel')
            ->update(['statut' => 'en_panne']);
        return response()->json(['success'=>true,'message'=>"Panne signalée — {$p->reference}",'data'=>$this->fmtPanne($p)], 201);
    }

    /** PATCH /api/st/eclairage/pannes/{id}/resoudre */
    public function resoudrePanne(Request $request, $id)
    {
        $p = PanneEclairage::findOrFail($id);
        $request->validate(['technicien' => 'nullable|string|max:200']);
        $p->update([
            'statut'           => 'resolue',
            'technicien'       => $request->technicien ?? auth()->user()?->name,
            'date_resolution'  => now()->format('Y-m-d'),
        ]);
        return response()->json(['success'=>true,'message'=>"Panne résolue — {$p->reference}",'data'=>$this->fmtPanne($p->fresh())]);
    }

    private function fmtPanne(PanneEclairage $p): array
    {
        return [
            'id' => $p->id, 'reference' => $p->reference, 'localisation' => $p->localisation,
            'description' => $p->description, 'date_signalement' => $p->date_signalement?->format('Y-m-d'),
            'technicien' => $p->technicien, 'date_resolution' => $p->date_resolution?->format('Y-m-d'),
            'statut' => $p->statut, 'created_at' => $p->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  MAINTENANCE ÉCLAIRAGE
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/eclairage/maintenance */
    public function indexMaintenance(Request $request)
    {
        $data = MaintenanceEclairage::query()->orderBy('date_prevue')->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($m) => $this->fmtMaint($m)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/eclairage/maintenance */
    public function storeMaintenance(Request $request)
    {
        $v = $request->validate([
            'zone'              => 'required|string|max:200',
            'nb_lampadaires'    => 'required|integer|min:1',
            'type_intervention' => 'required|string|max:150',
            'date_prevue'       => 'required|date',
            'technicien'        => 'required|string|max:200',
        ]);
        $m = MaintenanceEclairage::create(array_merge($v, ['statut' => 'programme']));
        return response()->json(['success'=>true,'message'=>"Maintenance planifiée — {$m->zone}",'data'=>$this->fmtMaint($m)], 201);
    }

    private function fmtMaint(MaintenanceEclairage $m): array
    {
        return [
            'id' => $m->id, 'zone' => $m->zone, 'nb_lampadaires' => $m->nb_lampadaires,
            'type_intervention' => $m->type_intervention, 'date_prevue' => $m->date_prevue?->format('Y-m-d'),
            'technicien' => $m->technicien, 'statut' => $m->statut, 'created_at' => $m->created_at?->toISOString(),
        ];
    }
}
