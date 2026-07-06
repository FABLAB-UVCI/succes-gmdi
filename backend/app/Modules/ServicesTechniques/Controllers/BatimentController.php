<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\BatimentCommunal;
use App\Modules\ServicesTechniques\Models\TravauxBatiment;
use Illuminate\Http\Request;

class BatimentController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  BÂTIMENTS
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/batiments */
    public function index(Request $request)
    {
        $query = BatimentCommunal::query()->orderBy('type')->orderBy('nom');
        if ($t = $request->get('type')) $query->where('type', $t);
        if ($e = $request->get('etat')) $query->where('etat', $e);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($b) => $this->fmtBat($b)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/batiments */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'                => 'required|string|max:200',
            'type'               => 'required|in:mairie,ecole,centre_social,marche,autre',
            'adresse'            => 'required|string|max:250',
            'superficie'         => 'required|numeric|min:1',
            'annee_construction' => 'nullable|integer|min:1900|max:' . date('Y'),
            'etat'               => 'nullable|in:bon,moyen,degrade',
            'responsable'        => 'nullable|string|max:200',
        ]);
        $b = BatimentCommunal::create(array_merge($v, ['etat' => $v['etat'] ?? 'bon']));
        return response()->json(['success'=>true,'message'=>"Bâtiment enregistré — {$b->nom}",'data'=>$this->fmtBat($b)], 201);
    }

    /** PUT /api/st/batiments/{id} */
    public function update(Request $request, $id)
    {
        $b = BatimentCommunal::findOrFail($id);
        $b->update($request->validate([
            'nom'        => 'sometimes|string|max:200',
            'adresse'    => 'sometimes|string|max:250',
            'etat'       => 'sometimes|in:bon,moyen,degrade',
            'responsable'=> 'nullable|string|max:200',
            'date_derniere_inspection' => 'nullable|date',
        ]));
        return response()->json(['success'=>true,'message'=>'Bâtiment mis à jour.','data'=>$this->fmtBat($b->fresh())]);
    }

    private function fmtBat(BatimentCommunal $b): array
    {
        return [
            'id' => $b->id, 'nom' => $b->nom, 'type' => $b->type, 'adresse' => $b->adresse,
            'superficie' => $b->superficie, 'annee_construction' => $b->annee_construction,
            'etat' => $b->etat, 'responsable' => $b->responsable,
            'date_derniere_inspection' => $b->date_derniere_inspection?->format('Y-m-d'),
            'created_at' => $b->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  TRAVAUX BÂTIMENTS
    // ═══════════════════════════════════════════════════════════════════════

    /** GET /api/st/batiments/travaux */
    public function indexTravaux(Request $request)
    {
        $query = TravauxBatiment::query()->orderByDesc('date_debut');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($t) => $this->fmtTrav($t)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /** POST /api/st/batiments/travaux */
    public function storeTravaux(Request $request)
    {
        $v = $request->validate([
            'batiment'    => 'required|string|max:200',
            'description' => 'required|string|max:500',
            'type'        => 'required|in:reparation,renovation,construction,entretien',
            'date_debut'  => 'required|date',
            'cout_estime' => 'nullable|numeric|min:0',
            'prestataire' => 'nullable|string|max:200',
        ]);
        $t = TravauxBatiment::create(array_merge($v, ['statut' => 'planifie']));
        return response()->json(['success'=>true,'message'=>"Travaux enregistrés — {$t->batiment}",'data'=>$this->fmtTrav($t)], 201);
    }

    /** PATCH /api/st/batiments/travaux/{id}/statut */
    public function updateStatutTravaux(Request $request, $id)
    {
        $t = TravauxBatiment::findOrFail($id);
        $request->validate(['statut' => 'required|in:planifie,en_cours,termine,suspendu']);
        if ($request->statut === 'termine') {
            $t->update(['statut' => 'termine', 'date_fin' => now()->format('Y-m-d')]);
        } else {
            $t->update(['statut' => $request->statut]);
        }
        return response()->json(['success'=>true,'message'=>"Statut mis à jour : {$t->statut}",'data'=>$this->fmtTrav($t->fresh())]);
    }

    private function fmtTrav(TravauxBatiment $t): array
    {
        return [
            'id' => $t->id, 'batiment' => $t->batiment, 'description' => $t->description,
            'type' => $t->type, 'date_debut' => $t->date_debut?->format('Y-m-d'),
            'date_fin' => $t->date_fin?->format('Y-m-d'), 'cout_estime' => $t->cout_estime,
            'prestataire' => $t->prestataire, 'statut' => $t->statut,
            'created_at' => $t->created_at?->toISOString(),
        ];
    }
}
