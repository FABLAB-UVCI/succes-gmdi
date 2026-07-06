<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Entretien;
use Illuminate\Http\Request;

class EntretienController extends Controller
{
    /**
     * GET /api/patrimoine/entretiens
     * Filtres : statut, page, per_page
     */
    public function index(Request $request)
    {
        $query = Entretien::query()->orderBy('date_prevue');

        if ($s = $request->get('statut')) {
            $query->where('statut', $s);
        }

        $perPage = (int) $request->get('per_page', 30);
        $data    = $query->paginate($perPage);

        return response()->json([
            'data'  => $data->map(fn($e) => $this->format($e)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /**
     * POST /api/patrimoine/entretiens
     * Planifie un nouvel entretien préventif
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bien'           => 'required|string|max:200',
            'type_entretien' => 'required|string|max:150',
            'date_prevue'    => 'required|date',
            'periodicite'    => 'nullable|in:Mensuelle,Trimestrielle,Semestrielle,Annuelle',
            'cout_estime'    => 'nullable|numeric|min:0',
        ]);

        $entretien = Entretien::create(array_merge($validated, [
            'statut' => 'programme',
        ]));

        return response()->json([
            'success' => true,
            'message' => "Entretien planifié — {$entretien->bien}",
            'data'    => $this->format($entretien),
        ], 201);
    }

    /**
     * GET /api/patrimoine/entretiens/{id}
     */
    public function show($id)
    {
        $e = Entretien::findOrFail($id);
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->format($e)]);
    }

    /**
     * PATCH /api/patrimoine/entretiens/{id}/valider
     * Marque l'entretien comme effectué
     */
    public function valider($id)
    {
        $e = Entretien::findOrFail($id);
        $e->update([
            'statut'        => 'effectue',
            'date_realise'  => now()->format('Y-m-d'),
        ]);

        return response()->json([
            'success' => true,
            'message' => "Entretien validé comme effectué — {$e->bien}",
            'data'    => $this->format($e->fresh()),
        ]);
    }

    /**
     * DELETE /api/patrimoine/entretiens/{id}
     */
    public function destroy($id)
    {
        Entretien::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Entretien supprimé.', 'data' => null]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function format(Entretien $e): array
    {
        return [
            'id'             => $e->id,
            'bien'           => $e->bien,
            'type_entretien' => $e->type_entretien,
            'date_prevue'    => $e->date_prevue,
            'date_realise'   => $e->date_realise,
            'periodicite'    => $e->periodicite ?? 'Trimestrielle',
            'cout_estime'    => $e->cout_estime ?? 0,
            'statut'         => $e->statut,
            'created_at'     => $e->created_at?->toISOString(),
        ];
    }

    private function meta($p): array
    {
        return ['current_page' => $p->currentPage(), 'last_page' => $p->lastPage(), 'per_page' => $p->perPage(), 'total' => $p->total(), 'from' => $p->firstItem(), 'to' => $p->lastItem()];
    }

    private function links($p): array
    {
        return ['first' => $p->url(1), 'last' => $p->url($p->lastPage()), 'prev' => $p->previousPageUrl(), 'next' => $p->nextPageUrl()];
    }
}
