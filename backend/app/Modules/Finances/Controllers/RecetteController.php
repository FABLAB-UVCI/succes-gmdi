<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\Recette;
use Illuminate\Http\Request;

class RecetteController extends Controller
{
    public function index()
    {
        return response()->json(Recette::orderByDesc('created_at')->get());
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
}
