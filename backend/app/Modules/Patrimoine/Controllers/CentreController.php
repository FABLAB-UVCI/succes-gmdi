<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\CentreCommunautaire;
use Illuminate\Http\Request;

class CentreController extends Controller
{
    /**
     * GET /api/patrimoine/centres
     */
    public function index()
    {
        $data = CentreCommunautaire::orderByDesc('created_at')->get();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $data->map(fn($c) => $this->fmt($c))]);
    }

    /**
     * POST /api/patrimoine/centres
     */
    public function store(Request $request)
    {
        $v = $request->validate([
            'nom'      => 'required|string|max:200',
            'quartier' => 'nullable|string|max:150',
            'capacite' => 'nullable|integer|min:0',
            'services' => 'nullable|string|max:300',
            'statut'   => 'nullable|in:operationnel,travaux',
        ]);

        $centre = CentreCommunautaire::create(array_merge($v, ['statut' => $v['statut'] ?? 'operationnel']));

        return response()->json([
            'success' => true,
            'message' => "Centre enregistré — {$centre->nom}",
            'data'    => $this->fmt($centre),
        ], 201);
    }

    /**
     * PUT /api/patrimoine/centres/{id}
     */
    public function update(Request $request, $id)
    {
        $c = CentreCommunautaire::findOrFail($id);
        $c->update($request->validate([
            'nom'      => 'sometimes|string|max:200',
            'quartier' => 'sometimes|string|max:150',
            'capacite' => 'sometimes|integer|min:0',
            'services' => 'sometimes|string|max:300',
            'statut'   => 'sometimes|in:operationnel,travaux',
        ]));
        return response()->json(['success' => true, 'message' => 'Centre mis à jour.', 'data' => $this->fmt($c->fresh())]);
    }

    /**
     * DELETE /api/patrimoine/centres/{id}
     */
    public function destroy($id)
    {
        CentreCommunautaire::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Centre supprimé.', 'data' => null]);
    }

    private function fmt(CentreCommunautaire $c): array
    {
        return [
            'id'         => $c->id,
            'nom'        => $c->nom,
            'quartier'   => $c->quartier,
            'capacite'   => $c->capacite,
            'services'   => $c->services,
            'statut'     => $c->statut,
            'created_at' => $c->created_at?->toISOString(),
        ];
    }
}
