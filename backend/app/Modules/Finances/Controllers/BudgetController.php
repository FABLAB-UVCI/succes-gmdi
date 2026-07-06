<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\Depense;
use App\Modules\Finances\Models\LigneBudget;
use App\Modules\Finances\Models\Recette;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function lignes()
    {
        return response()->json(LigneBudget::orderBy('chapitre')->get());
    }

    public function ajouterLigne(Request $request)
    {
        $data = $request->validate([
            'chapitre'            => 'required|in:recettes,personnel,fonctionnement,investissement',
            'article'             => 'required|string|max:100',
            'designation'         => 'required|string|max:255',
            'montantPrevisionnel' => 'required|numeric|min:0',
        ]);

        $ligne = LigneBudget::create([
            'chapitre'             => $data['chapitre'],
            'article'              => $data['article'],
            'designation'          => $data['designation'],
            'montant_previsionnel' => $data['montantPrevisionnel'],
            'montant_consomme'     => 0,
            'statut'               => 'provisoire',
        ]);

        return response()->json($ligne, 201);
    }

    public function revision(Request $request)
    {
        $data = $request->validate([
            'motif'           => 'required|string',
            'ligne_budget_id' => 'required|exists:lignes_budget,id',
            'montant'         => 'required|numeric|min:0',
        ]);

        $ligne = LigneBudget::findOrFail($data['ligne_budget_id']);
        $ligne->update(['montant_previsionnel' => $data['montant']]);

        return response()->json(['message' => 'Révision soumise', 'ligne' => $ligne]);
    }

    public function executionMensuelle()
    {
        $mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        $annee = date('Y');
        $data = [];

        for ($m = 1; $m <= 12; $m++) {
            $recettes = Recette::whereYear('date_paiement', $annee)
                ->whereMonth('date_paiement', $m)
                ->where('statut', 'valide')
                ->sum('montant');

            $depenses = Depense::whereYear('date_paiement', $annee)
                ->whereMonth('date_paiement', $m)
                ->where('statut', 'valide')
                ->sum('montant');

            $data[] = [
                'mois'     => $mois[$m - 1],
                'recettes' => (float) $recettes,
                'depenses' => (float) $depenses,
            ];
        }

        return response()->json($data);
    }
}
