<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class SystemController extends Controller
{
    /**
     * Lance migration + seed hors du démarrage du conteneur, pour ne pas
     * dépasser le budget du health-check de la plateforme d'hébergement.
     * Protégé par un jeton partagé (DEPLOY_TOKEN) — à appeler manuellement
     * une fois après chaque déploiement sur une base neuve. Sans effet
     * destructif : migrate/db:seed sont tous deux rejouables sans risque
     * (idempotents).
     */
    public function deploySetup(Request $request)
    {
        $expected = env('DEPLOY_TOKEN');

        if (empty($expected) || $request->query('token') !== $expected) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();

        Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = Artisan::output();

        return response()->json([
            'message' => 'Migration et seed exécutés.',
            'migrate' => trim($migrateOutput),
            'seed'    => trim($seedOutput),
        ]);
    }
}
