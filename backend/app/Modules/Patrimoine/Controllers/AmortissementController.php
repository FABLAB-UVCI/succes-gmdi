<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class AmortissementController extends Controller
{
    /**
     * GET /api/patrimoine/amortissements
     * Calcule dynamiquement le tableau d'amortissement depuis les biens
     */
    public function index()
    {
        // On prend les biens avec un taux d'amortissement > 0
        $biens = Bien::where('taux_amortissement', '>', 0)
                     ->orderByDesc('valeur_acquisition')
                     ->get();

        $lignes = $biens->map(function (Bien $b) {
            $anneeDebut  = (int) ($b->date_acquisition?->format('Y') ?? date('Y'));
            $anneesCourues = max(0, (int) date('Y') - $anneeDebut);
            $tauxDecimal  = $b->taux_amortissement / 100;

            // Amortissement linéaire
            $cumul = min($b->valeur_acquisition, $b->valeur_acquisition * $tauxDecimal * $anneesCourues);
            $vnc   = max(0, $b->valeur_acquisition - $cumul);

            return [
                'id'                    => $b->id,
                'bien'                  => $b->designation,
                'valeur_acquisition'    => $b->valeur_acquisition,
                'taux_annuel'           => $b->taux_amortissement,
                'annee_debut'           => $anneeDebut,
                'amortissement_cumule'  => round($cumul),
                'valeur_nette'          => round($vnc),
            ];
        });

        // Pagination manuelle
        $page    = (int) request('page', 1);
        $perPage = 20;
        $slice   = $lignes->slice(($page - 1) * $perPage, $perPage)->values();
        $total   = $lignes->count();

        return response()->json([
            'data' => $slice,
            'meta' => [
                'current_page' => $page,
                'last_page'    => (int) ceil($total / $perPage),
                'per_page'     => $perPage,
                'total'        => $total,
            ],
        ]);
    }

    /**
     * POST /api/patrimoine/amortissements/simuler
     * Simule l'amortissement d'un bien (calcul linéaire)
     *
     * Body : { valeur: number, taux: number, annees: number }
     */
    public function simuler(Request $request)
    {
        $request->validate([
            'valeur' => 'required|numeric|min:0',
            'taux'   => 'required|numeric|min:0|max:100',
            'annees' => 'required|integer|min:0',
        ]);

        $valeur = (float) $request->valeur;
        $taux   = (float) $request->taux / 100;
        $annees = (int) $request->annees;

        $cumul = min($valeur, $valeur * $taux * $annees);
        $vnc   = max(0, $valeur - $cumul);

        return response()->json([
            'success' => true,
            'message' => 'Simulation calculée.',
            'data'    => [
                'cumul' => round($cumul),
                'vnc'   => round($vnc),
            ],
        ]);
    }
}
