<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\DemandeRh;
use App\Support\GmdiAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

/**
 * Demandes internes des gestionnaires vers le service RH (augmentation,
 * formation, matériel, recrutement, congé, autre). Montée sous le préfixe
 * `rh-demandes`, volontairement exempté du filtrage par module (voir
 * EnforceGmdiModuleAccess::SKIP_PREFIXES) car un gestionnaire d'un autre
 * module (ex: Finances) n'a pas la permission `access.rh` mais doit
 * pouvoir soumettre une demande au RH. Seule la consultation/validation
 * globale est restreinte au service RH (vérifiée manuellement ci-dessous).
 */
class DemandeRhController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $estRh = GmdiAccess::canAccessModule($user, 'rh');

        $query = DemandeRh::query()->orderByDesc('created_at');

        if ($estRh) {
            if ($statut = $request->get('statut')) {
                $query->where('statut', $statut);
            }
        } else {
            // Un gestionnaire hors RH ne voit que ses propres demandes.
            $query->where('user_id', $user->id);
        }

        return response()->json(['data' => $query->get()->map(fn (DemandeRh $d) => $this->fmt($d))]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user->hasRole('citoyen') || $user->role === 'citoyen') {
            return response()->json(['message' => 'Réservé aux gestionnaires.'], 403);
        }

        $v = $request->validate([
            'module_origine' => ['required', 'string', Rule::in(GmdiAccess::MODULES)],
            'type_demande' => ['required', Rule::in(DemandeRh::TYPES)],
            'titre' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'max:2000'],
            'montant_demande' => ['nullable', 'numeric', 'min:0'],
        ]);

        $d = DemandeRh::create(array_merge($v, [
            'reference' => DemandeRh::generateReference(),
            'user_id' => $user->id,
            'demandeur_nom' => $user->name,
            'statut' => 'en_attente',
        ]));

        return response()->json([
            'success' => true,
            'message' => "Demande envoyée au service RH — {$d->reference}",
            'data' => $this->fmt($d),
        ], 201);
    }

    public function updateStatut(Request $request, DemandeRh $demandeRh): JsonResponse
    {
        $user = $request->user();
        if (! GmdiAccess::canAccessModule($user, 'rh')) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $v = $request->validate([
            'statut' => ['required', Rule::in(DemandeRh::STATUTS)],
            'commentaire_rh' => ['nullable', 'string', 'max:1000'],
        ]);

        $demandeRh->update($v);

        return response()->json(['success' => true, 'data' => $this->fmt($demandeRh->fresh())]);
    }

    private function fmt(DemandeRh $d): array
    {
        return [
            'id' => $d->id,
            'reference' => $d->reference,
            'demandeurNom' => $d->demandeur_nom,
            'moduleOrigine' => $d->module_origine,
            'typeDemande' => $d->type_demande,
            'titre' => $d->titre,
            'description' => $d->description,
            'montantDemande' => $d->montant_demande,
            'statut' => $d->statut,
            'commentaireRh' => $d->commentaire_rh,
            'createdAt' => $d->created_at?->toIso8601String(),
            'updatedAt' => $d->updated_at?->toIso8601String(),
        ];
    }
}
