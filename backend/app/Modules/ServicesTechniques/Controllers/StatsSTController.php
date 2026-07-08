<?php

namespace App\Modules\ServicesTechniques\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ServicesTechniques\Models\DemandeIntervention;
use App\Modules\ServicesTechniques\Models\ReparationVoirie;
use App\Modules\ServicesTechniques\Models\PanneEclairage;
use App\Modules\ServicesTechniques\Models\PlanningMaintenance;
use App\Modules\ServicesTechniques\Models\MaintenanceCorrective;
use App\Modules\ServicesTechniques\Models\BonTravail;
use Illuminate\Http\Request;

class StatsSTController extends Controller
{
    /**
     * GET /api/st/statistiques
     * Retourne exactement StatsServicesTechniquesApi Angular
     */
    public function dashboard()
    {
        // ── KPIs ─────────────────────────────────────────────────────────────
        $interventionsEnCours = BonTravail::where('statut', 'en_cours')->count()
            + BonTravail::where('statut', 'planifie')->count();

        $pannesSignalees = PanneEclairage::where('statut', 'signalee')->count()
            + ReparationVoirie::where('statut', 'signalee')->count()
            + MaintenanceCorrective::where('statut', 'signale')->count();

        $travauxPlanifies = PlanningMaintenance::where('statut', 'programme')->count()
            + BonTravail::where('statut', 'planifie')->count();

        $demandesCitoyennes = DemandeIntervention::where('statut', 'ouverte')->count();

        // Taux de résolution (demandes clôturées / total)
        $totalDemandes  = DemandeIntervention::count();
        $resolues       = DemandeIntervention::whereIn('statut', ['terminee','cloturee'])->count();
        $tauxResolution = $totalDemandes > 0 ? round($resolues / $totalDemandes * 100) : 0;

        // Délai moyen (jours entre dépôt et clôture) — calculé en PHP pour rester portable (SQLite/MySQL)
        $delaiMoyen = DemandeIntervention::whereNotNull('date_resolution')
            ->get(['date_depot', 'date_resolution'])
            ->avg(fn ($d) => $d->date_depot->diffInDays($d->date_resolution));

        // ── Répartition par service ───────────────────────────────────────────
        $parService = DemandeIntervention::selectRaw('type_service as service, COUNT(*) as nb')
            ->groupBy('type_service')
            ->get()
            ->map(fn($r) => ['service' => $r->service, 'nb' => (int)$r->nb]);

        // ── Demandes par statut ───────────────────────────────────────────────
        $parStatut = DemandeIntervention::selectRaw('statut, COUNT(*) as nb')
            ->groupBy('statut')
            ->get()
            ->map(fn($r) => ['statut' => $r->statut, 'nb' => (int)$r->nb]);

        // ── Maintenance ───────────────────────────────────────────────────────
        $maintPlanifiees    = PlanningMaintenance::where('statut', 'programme')->count();
        $maintRetard        = PlanningMaintenance::where('statut', 'en_retard')->count();
        $maintEffectueesMois= PlanningMaintenance::where('statut', 'effectue')
            ->whereMonth('updated_at', now()->month)
            ->count();

        return response()->json([
            'kpi' => [
                'interventions_en_cours' => $interventionsEnCours,
                'pannes_signalees'       => $pannesSignalees,
                'travaux_planifies'      => $travauxPlanifies,
                'demandes_citoyennes'    => $demandesCitoyennes,
                'taux_resolution'        => $tauxResolution,
                'delai_moyen_jours'      => round((float)$delaiMoyen, 1),
            ],
            'repartition_par_service' => $parService,
            'demandes_par_statut'     => $parStatut,
            'maintenance' => [
                'planifiees'        => $maintPlanifiees,
                'en_retard'         => $maintRetard,
                'effectuees_mois'   => $maintEffectueesMois,
            ],
        ]);
    }

    /**
     * GET /api/st/export?service=voirie|eclairage|eau|batiments|interventions|maintenance|all
     */
    public function export(Request $request)
    {
        $service = $request->get('service', 'all');

        $data = match ($service) {
            'voirie'        => ['routes' => \App\Modules\ServicesTechniques\Models\RouteVoirie::all(), 'entretiens' => \App\Modules\ServicesTechniques\Models\EntretienVoirie::all(), 'reparations' => \App\Modules\ServicesTechniques\Models\ReparationVoirie::all()],
            'eclairage'     => ['lampadaires' => \App\Modules\ServicesTechniques\Models\Lampadaire::all(), 'pannes' => \App\Modules\ServicesTechniques\Models\PanneEclairage::all()],
            'eau'           => ['caniveaux' => \App\Modules\ServicesTechniques\Models\Caniveau::all(), 'drainage' => \App\Modules\ServicesTechniques\Models\InterventionDrainage::all(), 'collectes' => \App\Modules\ServicesTechniques\Models\CollecteDechet::all()],
            'batiments'     => ['batiments' => \App\Modules\ServicesTechniques\Models\BatimentCommunal::all(), 'travaux' => \App\Modules\ServicesTechniques\Models\TravauxBatiment::all()],
            'interventions' => ['demandes' => DemandeIntervention::all(), 'bons' => BonTravail::all(), 'equipes' => \App\Modules\ServicesTechniques\Models\Equipe::all()],
            'maintenance'   => ['planning' => PlanningMaintenance::all(), 'corrective' => MaintenanceCorrective::all()],
            default => [
                'demandes'     => DemandeIntervention::all(),
                'bons'         => BonTravail::all(),
                'pannes'       => PanneEclairage::all(),
                'reparations'  => \App\Modules\ServicesTechniques\Models\ReparationVoirie::all(),
                'planning'     => PlanningMaintenance::all(),
                'corrective'   => MaintenanceCorrective::all(),
                'exported_at'  => now()->toISOString(),
            ],
        };

        $filename = "services_techniques_{$service}_" . now()->format('Y-m-d') . '.json';
        return response()->streamDownload(function () use ($data) {
            echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }, $filename, ['Content-Type' => 'application/json']);
    }
}
