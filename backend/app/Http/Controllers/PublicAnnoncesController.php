<?php

namespace App\Http\Controllers;

use App\Modules\Communication\Models\Actualite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Flux des annonces du Maire, lu par le widget "Annonces du Maire" présent
 * dans la sidebar de tous les modules gestionnaires. Monté sous le préfixe
 * `public` (voir EnforceGmdiModuleAccess::SKIP_PREFIXES) afin qu'un agent
 * n'ayant pas la permission `access.communication` (ex: un agent Finances)
 * puisse quand même consulter ces annonces informatives.
 *
 * Les annonces elles-mêmes restent des `Actualite` (type=annonce) créées
 * via le module Communication — le Maire y a accès sans restriction
 * (GmdiAccess::canAccessModule autorise tous les modules pour le rôle maire).
 */
class PublicAnnoncesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = min((int) $request->get('limit', 50), 100);

        $query = Actualite::query()
            ->where('type', 'annonce')
            ->where('statut', 'publie');

        // Un widget de module (sidebar gestionnaire) précise `module` et ne voit
        // que ce qui lui est destiné : ciblage exact, tous les services, ou public.
        // Sans ce paramètre (ex: tableau de bord du Maire), aucune restriction —
        // le Maire retrouve l'intégralité de ce qu'il a publié.
        if ($module = $request->get('module')) {
            $query->whereIn('audience', ['public', 'tous_services', $module]);
        }

        $data = $query
            ->orderByDesc('date')
            ->limit($limit)
            ->get()
            ->map(fn (Actualite $a) => [
                'id' => $a->id,
                'titre' => $a->titre,
                'contenu' => $a->contenu,
                'auteur' => $a->auteur,
                'date' => $a->date?->format('Y-m-d'),
                'urgent' => $a->categorie === 'Urgent',
                'audience' => $a->audience,
            ]);

        return response()->json(['data' => $data]);
    }
}
