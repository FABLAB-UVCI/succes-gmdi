<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Actualite;
use App\Modules\Communication\Models\CampagneSms;
use App\Modules\Communication\Models\Document;
use App\Modules\Finances\Models\LigneBudget;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Endpoints en lecture seule destinés au portail citoyen (module Communication).
 * Montés sous le préfixe /api/citoyen, non filtré par GmdiAccess (voir
 * EnforceGmdiModuleAccess::SKIP_PREFIXES) car ce ne sont pas des routes de
 * gestion interne mais un accès public d'information pour le citoyen connecté.
 */
class CitoyenCommunicationController extends Controller
{
    private function ensureCitoyen(Request $request): ?JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole('citoyen') && $user->role !== 'citoyen') {
            return response()->json(['message' => 'Réservé au portail citoyen.'], 403);
        }

        return null;
    }

    /** GET /api/citoyen/communication/actualites */
    public function actualites(Request $request): JsonResponse
    {
        if ($err = $this->ensureCitoyen($request)) {
            return $err;
        }

        $data = Actualite::query()
            ->where('statut', 'publie')
            ->whereIn('type', ['communique', 'annonce'])
            ->orderByDesc('date')
            ->get();

        return response()->json(['data' => $data]);
    }

    /** GET /api/citoyen/communication/agenda */
    public function agenda(Request $request): JsonResponse
    {
        if ($err = $this->ensureCitoyen($request)) {
            return $err;
        }

        $data = Actualite::query()
            ->where('statut', 'publie')
            ->where('type', 'evenement')
            ->orderBy('date')
            ->get();

        return response()->json(['data' => $data]);
    }

    /** GET /api/citoyen/communication/deliberations */
    public function deliberations(Request $request): JsonResponse
    {
        if ($err = $this->ensureCitoyen($request)) {
            return $err;
        }

        $data = Document::query()
            ->where('type', 'deliberation')
            ->orderByDesc('date')
            ->get();

        return response()->json(['data' => $data]);
    }

    /** GET /api/citoyen/communication/budget-simplifie */
    public function budgetSimplifie(Request $request): JsonResponse
    {
        if ($err = $this->ensureCitoyen($request)) {
            return $err;
        }

        $lignes = LigneBudget::query()->where('statut', 'approuve')->get();

        $parChapitre = $lignes->groupBy('chapitre')->map(function ($groupe, $chapitre) {
            return [
                'chapitre' => $chapitre,
                'montantPrevisionnel' => (float) $groupe->sum('montant_previsionnel'),
                'montantConsomme' => (float) $groupe->sum('montant_consomme'),
            ];
        })->values();

        return response()->json([
            'data' => $parChapitre,
            'totalPrevisionnel' => (float) $lignes->sum('montant_previsionnel'),
            'totalConsomme' => (float) $lignes->sum('montant_consomme'),
        ]);
    }

    /** GET /api/citoyen/communication/alertes */
    public function alertes(Request $request): JsonResponse
    {
        if ($err = $this->ensureCitoyen($request)) {
            return $err;
        }

        $data = CampagneSms::query()
            ->where('statut', 'envoye')
            ->orderByDesc('date_envoi')
            ->limit(30)
            ->get(['nom', 'type', 'message', 'date_envoi']);

        return response()->json(['data' => $data]);
    }
}
