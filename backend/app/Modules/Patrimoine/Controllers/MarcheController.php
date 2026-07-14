<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Marche;
use Illuminate\Http\Request;

class MarcheController extends Controller
{
    /**
     * GET /api/patrimoine/marches
     */
    public function index()
    {
        $data = Marche::orderByDesc('created_at')->get();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $data->map(fn($m) => $this->fmt($m))]);
    }

    /**
     * POST /api/patrimoine/marches
     */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'                   => 'required|string|max:200',
            'superficie'            => 'nullable|numeric|min:0',
            'nombre_boutiques'      => 'nullable|integer|min:0',
            'loyer_moyen_boutique'  => 'nullable|numeric|min:0',
            'statut'                => 'nullable|in:actif,rehabilitation,ferme',
        ]);

        $marche = Marche::create(array_merge($v, ['statut' => $v['statut'] ?? 'actif']));

        return response()->json([
            'success' => true,
            'message' => "Marché enregistré — {$marche->nom}",
            'data'    => $this->fmt($marche),
        ], 201);
    }

    /**
     * PUT /api/patrimoine/marches/{id}
     */
    public function update(Request $request, $id)
    {
        $m = Marche::findOrFail($id);
        $m->update($request->validate([
            'nom'                   => 'sometimes|string|max:200',
            'superficie'            => 'sometimes|numeric|min:0',
            'nombre_boutiques'      => 'sometimes|integer|min:0',
            'loyer_moyen_boutique'  => 'sometimes|numeric|min:0',
            'statut'                => 'sometimes|in:actif,rehabilitation,ferme',
        ]));
        return response()->json(['success' => true, 'message' => 'Marché mis à jour.', 'data' => $this->fmt($m->fresh())]);
    }

    /**
     * DELETE /api/patrimoine/marches/{id}
     */
    public function destroy($id)
    {
        Marche::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Marché supprimé.', 'data' => null]);
    }

    private function fmt(Marche $m): array
    {
        return [
            'id'                   => $m->id,
            'nom'                  => $m->nom,
            'superficie'           => $m->superficie,
            'nombre_boutiques'     => $m->nombre_boutiques,
            'loyer_moyen_boutique' => $m->loyer_moyen_boutique,
            'revenus_mensuels'     => $m->revenus_mensuels,
            'statut'               => $m->statut,
            'created_at'           => $m->created_at?->toISOString(),
        ];
    }
}
