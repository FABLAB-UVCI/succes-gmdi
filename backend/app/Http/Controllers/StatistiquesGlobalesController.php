<?php

namespace App\Http\Controllers;

use App\Models\Demarche;
use App\Models\User;
use App\Modules\Rh\Models\Agent;
use App\Modules\Finances\Models\Recette;
use App\Modules\Finances\Models\Depense;
use App\Modules\EtatCivil\Models\Naissance;
use App\Modules\EtatCivil\Models\Mariage;
use App\Modules\EtatCivil\Models\Deces;
use App\Modules\Urbanisme\Models\Permis;
use App\Modules\ServicesTechniques\Models\BonTravail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class StatistiquesGlobalesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Sécurité supplémentaire : seuls le maire ou l'admin peuvent accéder à ces stats
        if (! $user->hasRole('maire') && ! $user->hasRole('admin') && $user->role !== 'maire' && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé. Réservé au Maire ou à l\'Administrateur.'], 403);
        }

        // 1. Total citoyens
        $totalCitoyens = User::where('role', 'citoyen')->count();

        // 2. Démarches par statut
        $demarchesStats = [
            'total' => Demarche::count(),
            'en_attente' => Demarche::where('statut', 'en_attente')->count(),
            'en_cours' => Demarche::where('statut', 'en_cours')->count(),
            'valide' => Demarche::where('statut', 'valide')->count(),
            'refuse' => Demarche::where('statut', 'refuse')->count(),
        ];

        // 3. Démarches par module (répartition)
        $repartitionModules = Demarche::selectRaw('module, count(*) as total')
            ->groupBy('module')
            ->orderByDesc('total')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->module => $item->total];
            });

        // 4. Activités récentes (les 5 dernières démarches)
        $recentes = Demarche::with('user:id,name,email')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($d) {
                return [
                    'id' => $d->id,
                    'reference' => $d->reference,
                    'module' => $d->module,
                    'type_demarche' => $d->type_demarche,
                    'statut' => $d->statut,
                    'citoyen' => $d->user ? $d->user->name : 'Inconnu',
                    'date' => $d->created_at?->format('d/m/Y H:i'),
                ];
            });

        // 5. Nouvelles Stats: RH et Finances
        $totalAgents = Agent::count();
        $totalRevenus = Recette::where('statut', 'Payé')->sum('montant') + Recette::where('statut', 'Paye')->sum('montant'); // Gestion des accents au cas où

        return response()->json([
            'success' => true,
            'data' => [
                'citoyens' => $totalCitoyens,
                'demarches' => $demarchesStats,
                'modules' => $repartitionModules,
                'recentes' => $recentes,
                'agents' => $totalAgents,
                'revenus' => (float) $totalRevenus
            ]
        ]);
    }

    /**
     * GET /admin/bilan?periode=mois|annee
     * Bilan de synthèse sur une période, réservé au Maire/Administrateur.
     */
    public function bilan(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole('maire') && ! $user->hasRole('admin') && $user->role !== 'maire' && $user->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé. Réservé au Maire ou à l\'Administrateur.'], 403);
        }

        $periode = $request->get('periode', 'mois');
        $now = Carbon::now();
        if ($periode === 'annee') {
            $debut = $now->copy()->startOfYear();
            $fin = $now->copy()->endOfYear();
            $label = 'Année ' . $now->format('Y');
        } else {
            $periode = 'mois';
            $debut = $now->copy()->startOfMonth();
            $fin = $now->copy()->endOfMonth();
            $label = $now->translatedFormat('F Y');
        }

        $demarches = Demarche::whereBetween('created_at', [$debut, $fin]);
        $demarchesParStatut = (clone $demarches)->selectRaw('statut, count(*) as total')->groupBy('statut')->pluck('total', 'statut');
        $demarchesParModule = (clone $demarches)->selectRaw('module, count(*) as total')->groupBy('module')->pluck('total', 'module');

        $recettes = (float) Recette::whereBetween('created_at', [$debut, $fin])->where('statut', 'valide')->sum('montant');
        $depenses = (float) Depense::whereBetween('created_at', [$debut, $fin])->where('statut', 'valide')->sum('montant');

        return response()->json([
            'success' => true,
            'data' => [
                'periode' => $periode,
                'label' => $label,
                'debut' => $debut->toDateString(),
                'fin' => $fin->toDateString(),
                'demarches' => [
                    'total' => (clone $demarches)->count(),
                    'par_statut' => $demarchesParStatut,
                    'par_module' => $demarchesParModule,
                ],
                'finances' => [
                    'recettes' => $recettes,
                    'depenses' => $depenses,
                    'solde' => $recettes - $depenses,
                ],
                'etat_civil' => [
                    'naissances' => Naissance::whereBetween('created_at', [$debut, $fin])->count(),
                    'mariages' => Mariage::whereBetween('created_at', [$debut, $fin])->count(),
                    'deces' => Deces::whereBetween('created_at', [$debut, $fin])->count(),
                ],
                'urbanisme' => [
                    'permis_accordes' => Permis::where('statut', 'accorde')->whereBetween('updated_at', [$debut, $fin])->count(),
                ],
                'services_techniques' => [
                    'interventions_terminees' => BonTravail::where('statut', 'termine')->whereBetween('updated_at', [$debut, $fin])->count(),
                ],
                'nouveaux_citoyens' => User::where('role', 'citoyen')->whereBetween('created_at', [$debut, $fin])->count(),
            ],
        ]);
    }
}
