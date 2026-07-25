<?php

namespace App\Http\Controllers;

use App\Modules\Communication\Models\Actualite;
use Illuminate\Http\JsonResponse;

class PublicController extends Controller
{
    public function actualites(): JsonResponse
    {
        $items = Actualite::query()
            ->where('statut', 'publie')
            ->orderByDesc('date')
            ->limit(12)
            ->get(['id', 'type', 'titre', 'contenu', 'date', 'categorie']);

        return response()->json([
            'data' => $items->map(fn ($a) => [
                'id' => $a->id,
                'type' => $a->type,
                'titre' => $a->titre,
                'contenu' => $a->contenu,
                'date' => $a->date,
                'categorie' => $a->categorie,
            ]),
        ]);
    }

    public function services(): JsonResponse
    {
        return response()->json([
            'data' => [
                ['module' => 'etat-civil', 'titre' => 'État civil', 'description' => 'Actes, extraits, certificats'],
                ['module' => 'urbanisme', 'titre' => 'Urbanisme', 'description' => 'Permis et autorisations'],
                ['module' => 'services-techniques', 'titre' => 'Services techniques', 'description' => 'Voirie, éclairage, interventions'],
                ['module' => 'patrimoine', 'titre' => 'Patrimoine', 'description' => 'Occupation et autorisations'],
                ['module' => 'communication', 'titre' => 'Communication', 'description' => 'Réclamations et suggestions'],
            ],
        ]);
    }
}
