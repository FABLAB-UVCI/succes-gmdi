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
        $totalBiens       = Bien::count();
        $valeurTotale     = Bien::sum('valeur_actuelle');
        $valeurAcqTotale  = Bien::sum('valeur_acquisition');
        $urgences         = Reparation::where('priorite', 'urgente')->where('statut', 'en_cours')->count();

        // ── Loyers (marchés locatifs) ─────────────────────────────────────────
        $loyersMensuel = Bien::where('statut', 'loue')->sum('valeur_actuelle') * 0.006; // approx. 0.6%/mois

        // ── Par catégorie ──────────────────────────────────────────────────────
        $parCategorieRaw = Bien::selectRaw('categorie, COUNT(*) as nb, SUM(valeur_actuelle) as valeur')
            ->groupBy('categorie')
            ->get();

        $parCategorie = $parCategorieRaw->map(fn($r) => [
            'categorie' => $r->categorie,
            'nombre'    => (int) $r->nb,
            'valeur'    => (float) $r->valeur,
            'part'      => $totalBiens > 0 ? round((int) $r->nb / $totalBiens * 100, 1) : 0,
        ]);

        // ── Par statut ────────────────────────────────────────────────────────
        $parStatut = Bien::selectRaw('statut, COUNT(*) as nb, SUM(valeur_actuelle) as valeur')
            ->groupBy('statut')
            ->get()
            ->map(fn($r) => ['statut' => $r->statut, 'nombre' => (int) $r->nb, 'valeur' => (float) $r->valeur]);

        // ── Dépréciation par catégorie ────────────────────────────────────────
        $depreciationCategorie = Bien::selectRaw(
            'categorie, SUM(valeur_acquisition) as valeur_brute, AVG(taux_amortissement) as taux_moyen, SUM(valeur_acquisition - valeur_actuelle) as depreciation, SUM(valeur_actuelle) as valeur_nette'
        )
            ->groupBy('categorie')
            ->get()
            ->map(fn($r) => [
                'categorie'            => $r->categorie,
                'valeur_brute'         => (float) $r->valeur_brute,
                'taux_moyen'           => round((float) $r->taux_moyen, 1),
                'depreciation_annuelle'=> round((float) $r->valeur_brute * ((float) $r->taux_moyen / 100)),
                'valeur_nette'         => (float) $r->valeur_nette,
            ]);

        // ── Amortissements calculés dynamiquement depuis les biens ────────────
        $biensAmortissables = Bien::where('taux_amortissement', '>', 0)->get();
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
