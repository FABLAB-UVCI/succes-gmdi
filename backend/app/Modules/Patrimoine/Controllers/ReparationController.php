<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Reparation;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class ReparationController extends Controller
{
    /**
     * GET /api/patrimoine/reparations
     * Filtres : statut, priorite, page, per_page
     */
    public function index(Request $request)
    {
        $query = Reparation::query()
            ->orderByRaw("CASE priorite WHEN 'urgente' THEN 1 WHEN 'haute' THEN 2 WHEN 'normale' THEN 3 ELSE 4 END")
            ->orderByDesc('created_at');

        if ($s = $request->get('statut'))   $query->where('statut', $s);
        if ($p = $request->get('priorite')) $query->where('priorite', $p);

        $perPage = (int) $request->get('per_page', 20);
        $data    = $query->paginate($perPage);

        return response()->json([
            'data'  => $data->map(fn($r) => $this->format($r)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /**
     * POST /api/patrimoine/reparations
     * Déclare une nouvelle réparation / intervention corrective
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bien'        => 'required|string|max:200',
            'description' => 'required|string|max:500',
            'priorite'    => 'nullable|in:basse,normale,moyenne,haute,urgente,urgent',
            'prestataire' => 'nullable|string|max:200',
            'cout_estime' => 'nullable|numeric|min:0',
        ]);

        $rep = Reparation::create(array_merge($validated, [
            'statut'           => 'en_cours',
            'date_declaration' => now()->format('Y-m-d'),
            'priorite'         => $validated['priorite'] ?? 'normale',
        ]));

        // Si le bien est dans l'inventaire, le passer en maintenance
        Bien::where('designation', 'like', "%{$rep->bien}%")
            ->orWhere('reference', $rep->bien)
            ->update(['statut' => 'en_maintenance']);

        return response()->json([
            'success' => true,
            'message' => "Réparation déclarée — {$rep->bien}",
            'data'    => $this->format($rep),
        ], 201);
    }

    /**
     * GET /api/patrimoine/reparations/{id}
     */
    public function show($id)
    {
        $r = Reparation::findOrFail($id);
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->format($r)]);
    }

    /**
     * PATCH /api/patrimoine/reparations/{id}/resoudre
     * Marque la réparation comme résolue et remet le bien en service
     */
    public function resoudre(Request $request, $id)
    {
        $rep = Reparation::findOrFail($id);
        $rep->update([
            'statut'       => 'resolue',
            'date_resolue' => now()->format('Y-m-d'),
            'cout_reel'    => $request->get('cout_reel', $rep->cout_estime),
        ]);

        // Remettre le bien en service
        Bien::where('designation', 'like', "%{$rep->bien}%")
            ->orWhere('reference', $rep->bien)
            ->where('statut', 'en_maintenance')
            ->update(['statut' => 'occupe']);

        return response()->json([
            'success' => true,
            'message' => "Réparation résolue — {$rep->bien}",
            'data'    => $this->format($rep->fresh()),
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function format(Reparation $r): array
    {
        return [
            'id'               => $r->id,
            'bien'             => $r->bien,
            'description'      => $r->description,
            'priorite'         => $r->priorite,
            'prestataire'      => $r->prestataire ?? 'À désigner',
            'cout_estime'      => $r->cout_estime ?? 0,
            'cout_reel'        => $r->cout_reel,
            'statut'           => $r->statut,
            'date_declaration' => $r->date_declaration,
            'date_resolue'     => $r->date_resolue,
            'created_at'       => $r->created_at?->toISOString(),
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
