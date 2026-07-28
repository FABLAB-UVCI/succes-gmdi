<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Abonnement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AbonnementController extends Controller
{
    /** GET /api/com/abonnements — gestionnaire */
    public function index(Request $request): JsonResponse
    {
        $query = Abonnement::query()->orderByDesc('created_at');

        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json(['data' => $query->get()]);
    }

    /** POST /api/citoyen/communication/abonnements — citoyen */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole('citoyen') && $user->role !== 'citoyen') {
            return response()->json(['message' => 'Réservé au portail citoyen.'], 403);
        }

        $v = $request->validate([
            'nom' => ['required', 'string', 'max:120'],
            'prenom' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'telephone' => ['nullable', 'string', 'max:30'],
            'type_communication' => ['required', 'string', 'max:60'],
        ]);

        $abonnement = Abonnement::create([
            'user_id' => $user->id,
            'nom' => $v['nom'],
            'prenom' => $v['prenom'] ?? null,
            'email' => $v['email'],
            'telephone' => $v['telephone'] ?? null,
            'type_communication' => $v['type_communication'],
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Votre demande d\'abonnement a été enregistrée.',
            'data' => $abonnement,
        ], 201);
    }

    /** PATCH /api/com/abonnements/{id}/statut — gestionnaire */
    public function updateStatut(Request $request, Abonnement $abonnement): JsonResponse
    {
        $v = $request->validate([
            'statut' => ['required', 'string', Rule::in(Abonnement::STATUTS)],
        ]);

        $abonnement->update(['statut' => $v['statut']]);

        return response()->json(['success' => true, 'data' => $abonnement->fresh()]);
    }
}
