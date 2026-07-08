<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\Recette;
use Illuminate\Http\Request;

class RecetteController extends Controller
{
    public function index(Request $request)
    {
        $query = Recette::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('contribuable', 'like', "%$search%")
                  ->orWhere('reference', 'like', "%$search%");
            });
        }
        if ($type = $request->get('typeTaxe')) {
            $query->where('type_taxe', $type);
        }
        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'contribuable'      => 'required|string|max:255',
            'adresse'           => 'nullable|string|max:255',
            'serviceEmetteur'   => 'nullable|string|max:255',
            'operateur'         => 'nullable|string|max:255',
            'numeroTransaction' => 'nullable|string|max:100',
            'typeTaxe'          => 'required|string|max:100',
            'montant'           => 'required|numeric|min:0',
            'dateEcheance'      => 'required|date',
            'modePaiement'      => 'required|in:especes,virement,mobile_money,cheque',
            'statut'            => 'nullable|in:en_attente,valide,paye,retard',
        ]);

        $recette = Recette::create([
            'contribuable'       => $data['contribuable'],
            'adresse'            => $data['adresse'] ?? null,
            'service_emetteur'   => $data['serviceEmetteur'] ?? null,
            'operateur'          => $data['operateur'] ?? null,
            'numero_transaction' => $data['numeroTransaction'] ?? null,
            'type_taxe'          => $data['typeTaxe'],
            'montant'            => $data['montant'],
            'date_echeance'      => $data['dateEcheance'],
            'mode_paiement'      => $data['modePaiement'],
            'statut'             => $data['statut'] ?? 'en_attente',
        ]);

        return response()->json($recette, 201);
    }

    public function encaisser(string $id)
    {
        $recette = Recette::findOrFail($id);
        $recette->update([
            'statut'        => 'valide',
            'date_paiement' => now()->format('Y-m-d'),
        ]);
        return response()->json($recette);
    }

    public function update(Request $request, string $id)
    {
        $recette = Recette::findOrFail($id);

        $data = $request->validate([
            'contribuable'      => 'required|string|max:255',
            'adresse'           => 'nullable|string|max:255',
            'serviceEmetteur'   => 'nullable|string|max:255',
            'operateur'         => 'nullable|string|max:255',
            'numeroTransaction' => 'nullable|string|max:100',
            'typeTaxe'          => 'required|string|max:100',
            'montant'           => 'required|numeric|min:0',
            'dateEcheance'      => 'required|date',
            'modePaiement'      => 'required|in:especes,virement,mobile_money,cheque',
            'statut'            => 'nullable|in:en_attente,valide,paye,retard',
        ]);

        $recette->update([
            'contribuable'       => $data['contribuable'],
            'adresse'            => $data['adresse'] ?? null,
            'service_emetteur'   => $data['serviceEmetteur'] ?? null,
            'operateur'          => $data['operateur'] ?? null,
            'numero_transaction' => $data['numeroTransaction'] ?? null,
            'type_taxe'          => $data['typeTaxe'],
            'montant'            => $data['montant'],
            'date_echeance'      => $data['dateEcheance'],
            'mode_paiement'      => $data['modePaiement'],
            'statut'             => $data['statut'] ?? $recette->statut,
        ]);

        return response()->json($recette->fresh());
    }

    public function destroy(string $id)
    {
        Recette::findOrFail($id)->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
