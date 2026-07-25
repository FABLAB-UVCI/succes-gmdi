<?php

namespace App\Http\Controllers;

use App\Models\Demarche;
use App\Models\User;
use App\Modules\Rh\Models\Agent;
use App\Modules\Finances\Models\Recette;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
}
