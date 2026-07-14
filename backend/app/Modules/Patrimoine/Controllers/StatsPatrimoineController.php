<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use App\Modules\Patrimoine\Models\Terrain;
use App\Modules\Patrimoine\Models\Entretien;
use App\Modules\Patrimoine\Models\Reparation;
use Illuminate\Http\Request;

class StatsPatrimoineController extends Controller
{
    /**
     * GET /api/patrimoine/statistiques
     * Dashboard KPIs global + répartition catégorie/statut + stats amortissement
     */
    public function dashboard(Request $request)
    {
        // ── Biens ─────────────────────────────────────────────────────────────
        // Chargés une seule fois et agrégés en PHP pour utiliser la valeur nette
        // comptable RECALCULÉE (valeur_actuelle_calculee), et non la colonne
        // `valeur_actuelle` qui n'est jamais mise à jour après la création du bien
        // — sinon ces stats divergent du tableau d'amortissement (AmortissementController).
        $biens            = Bien::all();
        $totalBiens       = $biens->count();
        $valeurTotale     = $biens->sum(fn($b) => $b->valeur_actuelle_calculee);
        $valeurAcqTotale  = $biens->sum('valeur_acquisition');
        $urgences         = Reparation::where('priorite', 'urgente')->where('statut', 'en_cours')->count();

        // ── Loyers (marchés locatifs) ─────────────────────────────────────────
        $loyersMensuel = $biens->where('statut', 'loue')->sum(fn($b) => $b->valeur_actuelle_calculee) * 0.006; // approx. 0.6%/mois

        // ── Par catégorie ──────────────────────────────────────────────────────
        $parCategorie = $biens->groupBy('categorie')->map(function ($grp, $cat) use ($totalBiens) {
            return [
                'categorie' => $cat,
                'nombre'    => $grp->count(),
                'valeur'    => $grp->sum(fn($b) => $b->valeur_actuelle_calculee),
                'part'      => $totalBiens > 0 ? round($grp->count() / $totalBiens * 100, 1) : 0,
            ];
        })->values();

        // ── Par statut ────────────────────────────────────────────────────────
        $parStatut = $biens->groupBy('statut')->map(function ($grp, $statut) {
            return [
                'statut' => $statut,
                'nombre' => $grp->count(),
                'valeur' => $grp->sum(fn($b) => $b->valeur_actuelle_calculee),
            ];
        })->values();

        // ── Dépréciation par catégorie ────────────────────────────────────────
        $depreciationCategorie = $biens->groupBy('categorie')->map(function ($grp, $cat) {
            $valeurBrute = $grp->sum('valeur_acquisition');
            $valeurNette = $grp->sum(fn($b) => $b->valeur_actuelle_calculee);
            $tauxMoyen   = $grp->avg('taux_amortissement');
            return [
                'categorie'             => $cat,
                'valeur_brute'          => $valeurBrute,
                'taux_moyen'            => round($tauxMoyen, 1),
                'depreciation_annuelle' => round($valeurBrute * ($tauxMoyen / 100)),
                'valeur_nette'          => $valeurNette,
            ];
        })->values();

        // ── Amortissements calculés dynamiquement depuis les biens ────────────
        $biensAmortissables = $biens->where('taux_amortissement', '>', 0);
        $amortCumules = 0;
        $vnc          = 0;
        $biensAmortis = 0;
        foreach ($biensAmortissables as $b) {
            $annees = max(0, (int) date('Y') - (int) ($b->date_acquisition?->format('Y') ?? date('Y')));
            $cumul  = min($b->valeur_acquisition, $b->valeur_acquisition * ($b->taux_amortissement / 100) * $annees);
            $bVnc   = max(0, $b->valeur_acquisition - $cumul);
            $amortCumules += $cumul;
            $vnc          += $bVnc;
            if ($bVnc == 0) $biensAmortis++;
        }

        return response()->json([
            'total_biens'               => $totalBiens,
            'valeur_totale'             => $valeurTotale,
            'loyers_mensuel'            => round($loyersMensuel),
            'urgences'                  => $urgences,
            'valeur_acquisition_totale' => $valeurAcqTotale,
            'valeur_nette_totale'       => round($vnc),
            'amortissements_cumules'    => round($amortCumules),
            'biens_amortis'             => $biensAmortis,
            'repartition_categorie'     => $parCategorie,
            'repartition_statut'        => $parStatut,
            'depreciation_categorie'    => $depreciationCategorie,
        ]);
    }

    /**
     * GET /api/patrimoine/export?type=biens|terrains|entretiens|reparations|amortissements|all
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'all');

        $data = match ($type) {
            'biens'       => Bien::all(),
            'terrains'    => Terrain::all(),
            'entretiens'  => Entretien::all(),
            'reparations' => Reparation::all(),
            default       => [
                'biens'       => Bien::all(),
                'terrains'    => Terrain::all(),
                'entretiens'  => Entretien::all(),
                'reparations' => Reparation::all(),
                'exported_at' => now()->toISOString(),
            ],
        };

        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, "patrimoine_{$type}_" . now()->format('Y-m-d') . '.json', [
            'Content-Type' => 'application/json',
        ]);
    }
}
