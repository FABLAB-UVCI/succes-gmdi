<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Terrain;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class TerrainController extends Controller
{
    public function index(Request $request)
    {
        $data = Terrain::query()->orderByDesc('created_at')->paginate(20);
        return response()->json([
            'data'  => $data->map(fn($t) => $this->fmt($t)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'localisation'    => 'required|string|max:200',
            'superficie'      => 'required|numeric|min:0',
            'valeur'          => 'nullable|numeric|min:0',
            'usage'           => 'nullable|string|max:100',
            'titre_foncier'   => 'nullable|string|max:50',
            'date_acquisition'=> 'nullable|date',
        ]);

        $terrain = Terrain::create(array_merge($v, ['statut' => 'Reserve']));

        $ref = 'PAT-TER-' . str_pad(Bien::where('categorie', 'terrain')->count() + 1, 3, '0', STR_PAD_LEFT);
        Bien::create([
            'reference'          => $ref,
            'designation'        => "Terrain — {$terrain->localisation}",
            'categorie'          => 'terrain',
            'localisation'       => $terrain->localisation,
            'superficie'         => $terrain->superficie,
            'valeur_acquisition' => $terrain->valeur ?? 0,
            'valeur_actuelle'    => $terrain->valeur ?? 0,
            'date_acquisition'   => $terrain->date_acquisition ?? now()->format('Y-m-d'),
            'affectation'        => $terrain->usage ?? 'Réserve foncière',
            'statut'             => 'disponible',
            'taux_amortissement' => 0,
            'qr_code'            => 'QR-' . $ref,
        ]);

        return response()->json(['success' => true, 'message' => "Terrain enregistré — {$terrain->localisation}", 'data' => $this->fmt($terrain)], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->fmt(Terrain::findOrFail($id))]);
    }

    public function update(Request $request, $id)
    {
        $t = Terrain::findOrFail($id);
        $t->update($request->validate([
            'localisation'  => 'sometimes|string|max:200',
            'valeur'        => 'sometimes|numeric|min:0',
            'usage'         => 'sometimes|string|max:100',
            'titre_foncier' => 'sometimes|string|max:50',
        ]));
        return response()->json(['success' => true, 'message' => 'Terrain mis à jour.', 'data' => $this->fmt($t->fresh())]);
    }

    public function destroy($id)
    {
        Terrain::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Terrain supprimé.', 'data' => null]);
    }

    private function fmt(Terrain $t): array
    {
        return [
            'id'               => $t->id,
            'localisation'     => $t->localisation,
            'superficie'       => $t->superficie,
            'valeur'           => $t->valeur,
            'usage'            => $t->usage,
            'titre_foncier'    => $t->titre_foncier,
            'date_acquisition' => $t->date_acquisition?->format('Y-m-d'),
            'statut'           => $t->statut,
            'created_at'       => $t->created_at?->toISOString(),
        ];
    }

    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }
}
