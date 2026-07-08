<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\Depense;
use Illuminate\Http\Request;

class DepenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Depense::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('objet', 'like', "%$search%")
                  ->orWhere('fournisseur', 'like', "%$search%")
                  ->orWhere('reference', 'like', "%$search%");
            });
        }
        if ($chapitre = $request->get('chapitre')) {
            $query->where('chapitre', $chapitre);
        }
        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'objet'          => 'required|string|max:255',
            'fournisseur'    => 'required|string|max:255',
            'montant'        => 'required|numeric|min:0',
            'chapitre'       => 'required|in:recettes,personnel,fonctionnement,investissement',
            'article'        => 'required|string|max:100',
            'dateEngagement' => 'nullable|date',
            'description'    => 'nullable|string',
            'statut'         => 'nullable|in:en_attente,valide,engage,paye',
        ]);

        $depense = Depense::create([
            'objet'           => $data['objet'],
            'fournisseur'     => $data['fournisseur'],
            'montant'         => $data['montant'],
            'chapitre'        => $data['chapitre'],
            'article'         => $data['article'],
            'date_engagement' => $data['dateEngagement'] ?? now()->format('Y-m-d'),
            'description'     => $data['description'] ?? '',
            'statut'          => $data['statut'] ?? 'en_attente',
        ]);

        return response()->json($depense, 201);
    }

    public function payer(string $id)
    {
        $depense = Depense::findOrFail($id);
        $depense->update([
            'statut'        => 'valide',
            'date_paiement' => now()->format('Y-m-d'),
        ]);
        return response()->json($depense);
    }

    public function update(Request $request, string $id)
    {
        $depense = Depense::findOrFail($id);

        $data = $request->validate([
            'objet'          => 'required|string|max:255',
            'fournisseur'    => 'required|string|max:255',
            'montant'        => 'required|numeric|min:0',
            'chapitre'       => 'required|in:recettes,personnel,fonctionnement,investissement',
            'article'        => 'required|string|max:100',
            'dateEngagement' => 'nullable|date',
            'description'    => 'nullable|string',
            'statut'         => 'nullable|in:en_attente,valide,engage,paye',
        ]);

        $depense->update([
            'objet'           => $data['objet'],
            'fournisseur'     => $data['fournisseur'],
            'montant'         => $data['montant'],
            'chapitre'        => $data['chapitre'],
            'article'         => $data['article'],
            'date_engagement' => $data['dateEngagement'] ?? $depense->date_engagement,
            'description'     => $data['description'] ?? '',
            'statut'          => $data['statut'] ?? $depense->statut,
        ]);

        return response()->json($depense->fresh());
    }

    public function destroy(string $id)
    {
        Depense::findOrFail($id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
