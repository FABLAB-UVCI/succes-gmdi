<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use App\Modules\Patrimoine\Models\MouvementAffectation;
use Illuminate\Http\Request;

class AffectationController extends Controller
{
    /**
     * GET /api/patrimoine/affectations
     * Filtres : reference, page, per_page
     */
    public function index(Request $request)
    {
        $query = MouvementAffectation::query()->orderByDesc('date');

        if ($ref = $request->get('reference')) {
            $query->where('reference', 'like', "%{$ref}%");
        }

        $perPage = (int) $request->get('per_page', 20);
        $data    = $query->paginate($perPage);

        return response()->json([
            'data'  => $data->map(fn($m) => $this->format($m)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /**
     * POST /api/patrimoine/affectations
     * Attribue un bien à un service et crée un mouvement dans l'historique
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference'   => 'required|string|max:30',
            'direction'   => 'required|string|max:200',
            'responsable' => 'nullable|string|max:200',
            'date_effet'  => 'required|date',
            'motif'       => 'nullable|string|max:255',
        ]);

        // Trouver le bien
        $bien = Bien::where('reference', $validated['reference'])->first();

        if (!$bien) {
            return response()->json([
                'success' => false,
                'message' => "Bien non trouvé pour la référence : {$validated['reference']}",
                'data'    => null,
            ], 404);
        }

        $ancienneAffectation = $bien->affectation;

        // Créer le mouvement dans l'historique
        $mouvement = MouvementAffectation::create([
            'date'        => $validated['date_effet'],
            'reference'   => $validated['reference'],
            'bien'        => $bien->designation,
            'origine'     => $ancienneAffectation,
            'destination' => $validated['direction'],
            'responsable' => $validated['responsable'] ?? auth()->user()->name,
            'motif'       => $validated['motif'] ?? '—',
        ]);

        // Mettre à jour l'affectation du bien
        $bien->update([
            'affectation' => $validated['direction'],
            'statut'      => 'occupe',
        ]);

        return response()->json([
            'success' => true,
            'message' => "Affectation enregistrée — {$validated['reference']} → {$validated['direction']}",
            'data'    => $this->format($mouvement),
        ], 201);
    }

    /**
     * GET /api/patrimoine/affectations/export
     * Export JSON de tout l'historique des mouvements
     */
    public function export()
    {
        $data = MouvementAffectation::orderByDesc('date')->get();

        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, 'historique_affectations_' . now()->format('Y-m-d') . '.json', [
            'Content-Type' => 'application/json',
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function format(MouvementAffectation $m): array
    {
        return [
            'id'          => $m->id,
            'date'        => $m->date?->format('Y-m-d'),
            'reference'   => $m->reference,
            'bien'        => $m->bien,
            'origine'     => $m->origine,
            'destination' => $m->destination,
            'responsable' => $m->responsable,
            'motif'       => $m->motif,
            'created_at'  => $m->created_at?->toISOString(),
        ];
    }

    private function meta($p): array
    {
        return [
            'current_page' => $p->currentPage(),
            'last_page'    => $p->lastPage(),
            'per_page'     => $p->perPage(),
            'total'        => $p->total(),
            'from'         => $p->firstItem(),
            'to'           => $p->lastItem(),
        ];
    }

    private function links($p): array
    {
        return [
            'first' => $p->url(1),
            'last'  => $p->url($p->lastPage()),
            'prev'  => $p->previousPageUrl(),
            'next'  => $p->nextPageUrl(),
        ];
    }
}
