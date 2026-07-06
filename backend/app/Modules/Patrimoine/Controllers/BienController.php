<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class BienController extends Controller
{
    // Préfixes de référence par catégorie
    const REF_PREFIX = [
        'mobilier'    => 'MOB',
        'informatique'=> 'INF',
        'vehicule'    => 'VEH',
        'equipement'  => 'EQP',
        'immobilier'  => 'IMM',
        'terrain'     => 'TER',
    ];

    /**
     * GET /api/patrimoine/biens
     * Filtres : search, categorie, statut, page, per_page
     */
    public function index(Request $request)
    {
        $query = Bien::query()->orderByDesc('created_at');

        if ($q = $request->get('search')) {
            $query->where(function ($sq) use ($q) {
                $sq->where('designation', 'like', "%{$q}%")
                   ->orWhere('reference', 'like', "%{$q}%")
                   ->orWhere('affectation', 'like', "%{$q}%");
            });
        }
        if ($c = $request->get('categorie')) $query->where('categorie', $c);
        if ($s = $request->get('statut'))    $query->where('statut', $s);

        $perPage = (int) $request->get('per_page', 20);
        $data    = $query->paginate($perPage);

        return response()->json([
            'data'  => $data->map(fn($b) => $this->format($b)),
            'meta'  => $this->meta($data),
            'links' => $this->links($data),
        ]);
    }

    /**
     * POST /api/patrimoine/biens
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'categorie'           => 'required|in:mobilier,informatique,vehicule,equipement,immobilier,terrain',
            'designation'         => 'required|string|max:200',
            'localisation'        => 'required|string|max:200',
            'valeur_acquisition'  => 'required|numeric|min:0',
            'date_acquisition'    => 'required|date',
            'affectation'         => 'required|string|max:200',
            'taux_amortissement'  => 'nullable|numeric|min:0|max:100',
            'superficie'          => 'nullable|numeric|min:0',
        ]);

        $reference = $this->genReference($validated['categorie']);

        $bien = Bien::create(array_merge($validated, [
            'reference'      => $reference,
            'valeur_actuelle'=> $validated['valeur_acquisition'],
            'statut'         => 'disponible',
            'qr_code'        => 'QR-' . $reference,
        ]));

        return response()->json([
            'success' => true,
            'message' => "Bien enregistré — {$bien->reference}",
            'data'    => $this->format($bien),
        ], 201);
    }

    /**
     * GET /api/patrimoine/biens/{id}
     */
    public function show($id)
    {
        $bien = Bien::findOrFail($id);
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->format($bien)]);
    }

    /**
     * GET /api/patrimoine/biens/reference/{ref}
     */
    public function findByReference(string $ref)
    {
        $bien = Bien::where('reference', $ref)->firstOrFail();
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->format($bien)]);
    }

    /**
     * PUT /api/patrimoine/biens/{id}
     */
    public function update(Request $request, $id)
    {
        $bien = Bien::findOrFail($id);
        $bien->update($request->validate([
            'designation'        => 'sometimes|string|max:200',
            'localisation'       => 'sometimes|string|max:200',
            'valeur_actuelle'    => 'sometimes|numeric|min:0',
            'affectation'        => 'sometimes|string|max:200',
            'taux_amortissement' => 'sometimes|numeric|min:0|max:100',
            'statut'             => 'sometimes|in:occupe,disponible,loue,en_maintenance',
        ]));
        return response()->json(['success' => true, 'message' => 'Bien mis à jour.', 'data' => $this->format($bien->fresh())]);
    }

    /**
     * DELETE /api/patrimoine/biens/{id}
     */
    public function destroy($id)
    {
        Bien::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Bien supprimé.', 'data' => null]);
    }

    /**
     * PATCH /api/patrimoine/biens/{id}/statut
     */
    public function updateStatut(Request $request, $id)
    {
        $bien = Bien::findOrFail($id);
        $request->validate(['statut' => 'required|in:occupe,disponible,loue,en_maintenance']);
        $bien->update(['statut' => $request->statut]);
        return response()->json(['success' => true, 'message' => 'Statut mis à jour.', 'data' => $this->format($bien->fresh())]);
    }

    /**
     * GET /api/patrimoine/biens/{id}/qr
     */
    public function qrCode($id)
    {
        $bien = Bien::findOrFail($id);
        return response()->json([
            'success' => true,
            'message' => 'QR Code généré.',
            'data'    => [
                'qr_code' => $bien->qr_code,
                'url'     => url("/api/patrimoine/biens/reference/{$bien->reference}"),
            ],
        ]);
    }

    /**
     * GET /api/patrimoine/biens/{id}/fiche  — PDF fiche bien (placeholder)
     */
    public function fiche($id)
    {
        $bien = Bien::findOrFail($id);
        // TODO: PDF::loadView('patrimoine.fiche_bien', compact('bien'))->download(...)
        return response()->json(['success' => true, 'message' => 'PDF — À implémenter avec DomPDF', 'data' => $this->format($bien)]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function genReference(string $categorie): string
    {
        $pfx = self::REF_PREFIX[$categorie] ?? 'GEN';
        $seq = Bien::where('categorie', $categorie)->count() + 1;
        return "PAT-{$pfx}-" . str_pad($seq, 3, '0', STR_PAD_LEFT);
    }

    public function format(Bien $b): array
    {
        return [
            'id'                  => $b->id,
            'reference'           => $b->reference,
            'designation'         => $b->designation,
            'categorie'           => $b->categorie,
            'localisation'        => $b->localisation,
            'superficie'          => $b->superficie,
            'valeur_acquisition'  => $b->valeur_acquisition,
            'valeur_actuelle'     => $b->valeur_actuelle,
            'date_acquisition'    => $b->date_acquisition?->format('Y-m-d'),
            'affectation'         => $b->affectation,
            'statut'              => $b->statut,
            'taux_amortissement'  => $b->taux_amortissement,
            'qr_code'             => $b->qr_code,
            'created_at'          => $b->created_at?->toISOString(),
            'updated_at'          => $b->updated_at?->toISOString(),
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
