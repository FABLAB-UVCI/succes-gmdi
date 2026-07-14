<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Batiment;
use Illuminate\Http\Request;

class BatimentController extends Controller
{
    /**
     * GET /api/patrimoine/batiments
     */
    public function index()
    {
        $data = Batiment::orderByDesc('created_at')->get();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $data->map(fn($b) => $this->fmt($b))]);
    }

    /**
     * POST /api/patrimoine/batiments
     */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'                 => 'required|string|max:200',
            'superficie'          => 'nullable|numeric|min:0',
            'valeur_actuelle'     => 'nullable|numeric|min:0',
            'affectation'         => 'nullable|string|max:200',
            'etat'                => 'nullable|in:bon,moyen,degrade',
            'derniere_inspection' => 'nullable|date',
        ]);

        $batiment = Batiment::create(array_merge($v, ['etat' => $v['etat'] ?? 'bon']));

        return response()->json([
            'success' => true,
            'message' => "Bâtiment enregistré — {$batiment->nom}",
            'data'    => $this->fmt($batiment),
        ], 201);
    }

    /**
     * PUT /api/patrimoine/batiments/{id}
     */
    public function update(Request $request, $id)
    {
        $b = Batiment::findOrFail($id);
        $b->update($request->validate([
            'nom'                 => 'sometimes|string|max:200',
            'superficie'          => 'sometimes|numeric|min:0',
            'valeur_actuelle'     => 'sometimes|numeric|min:0',
            'affectation'         => 'sometimes|string|max:200',
            'etat'                => 'sometimes|in:bon,moyen,degrade',
            'derniere_inspection' => 'sometimes|date',
        ]));
        return response()->json(['success' => true, 'message' => 'Bâtiment mis à jour.', 'data' => $this->fmt($b->fresh())]);
    }

    /**
     * DELETE /api/patrimoine/batiments/{id}
     */
    public function destroy($id)
    {
        Batiment::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Bâtiment supprimé.', 'data' => null]);
    }

    private function fmt(Batiment $b): array
    {
        return [
            'id'                  => $b->id,
            'nom'                 => $b->nom,
            'superficie'          => $b->superficie,
            'valeur_actuelle'     => $b->valeur_actuelle,
            'affectation'         => $b->affectation,
            'etat'                => $b->etat,
            'derniere_inspection' => $b->derniere_inspection?->format('Y-m-d'),
            'created_at'          => $b->created_at?->toISOString(),
        ];
    }
}
