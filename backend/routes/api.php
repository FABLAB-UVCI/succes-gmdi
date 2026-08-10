<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Modules — état-civil
use App\Modules\EtatCivil\Controllers\NaissanceController;
use App\Modules\EtatCivil\Controllers\MariageController;
use App\Modules\EtatCivil\Controllers\DecesController;
use App\Modules\EtatCivil\Controllers\CertificatController;
use App\Modules\EtatCivil\Controllers\StatistiquesController;
use App\Modules\EtatCivil\Controllers\PublicationBansController;

// Modules — RH
use App\Modules\Rh\Controllers\AgentController;
use App\Modules\Rh\Controllers\CongeController;
use App\Modules\Rh\Controllers\AbsenceController;
use App\Modules\Rh\Controllers\RecrutementController;
use App\Modules\Rh\Controllers\FormationController;
use App\Modules\Rh\Controllers\DepartController;

/*
|--------------------------------------------------------------------------
| Authentification (partagée par tous les modules)
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::middleware('throttle:8,1')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('change-password', [AuthController::class, 'changePassword'])->middleware('throttle:8,1');
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('demarches', [App\Http\Controllers\DemarcheController::class, 'index']);
    Route::post('demarches', [App\Http\Controllers\DemarcheController::class, 'store']);
    Route::put('demarches/{demarche}', [App\Http\Controllers\DemarcheController::class, 'update']);
    Route::get('demarches/{demarche}/document', [App\Http\Controllers\DemarcheController::class, 'downloadDocument']);
    Route::get('demarches/{demarche}/pieces/{index}', [App\Http\Controllers\DemarcheController::class, 'downloadPiece']);

    // Notifications citoyen
    Route::get('notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::put('notifications/{notification}/read', [App\Http\Controllers\NotificationController::class, 'markRead']);
    Route::put('notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllRead']);

    // Route globale pour le Maire / Admin
    Route::get('admin/statistiques', [App\Http\Controllers\StatistiquesGlobalesController::class, 'index']);

    // Annonces du Maire — lecture publique inter-modules (voir PublicAnnoncesController)
    Route::prefix('public')->group(function () {
        Route::get('annonces', [App\Http\Controllers\PublicAnnoncesController::class, 'index']);
    });
});

/*
|--------------------------------------------------------------------------
| Modules métier (protégés par Sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // --- État civil ---
    Route::prefix('etat-civil')->group(function () {
        Route::apiResource('naissances', NaissanceController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::apiResource('mariages', MariageController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('deces', DecesController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('certificats', CertificatController::class)->only(['index', 'store', 'update', 'destroy']);
        Route::apiResource('publications-bans', PublicationBansController::class)->only(['index', 'store', 'destroy']);
        Route::get('statistiques', [StatistiquesController::class, 'index']);
    });

    // --- Ressources humaines ---
    Route::prefix('rh')->group(function () {
        Route::get('agents/{id}/fiche', [AgentController::class, 'fiche']);
        Route::apiResource('agents', AgentController::class);
        Route::apiResource('conges', CongeController::class);
        Route::apiResource('absences', AbsenceController::class);
        Route::apiResource('recrutements', RecrutementController::class);
        Route::apiResource('formations', FormationController::class);
        Route::apiResource('departs', DepartController::class);
    });
});

/*
|--------------------------------------------------------------------------
| Autres modules (chaque fichier applique son propre middleware auth:sanctum)
|--------------------------------------------------------------------------
*/
require __DIR__.'/modules/communication.php';       // préfixe interne: com
require __DIR__.'/modules/citoyen-communication.php'; // préfixe interne: citoyen (lecture seule + abonnement)
require __DIR__.'/modules/finances.php';            // préfixes: recettes, depenses, budget, …
require __DIR__.'/modules/patrimoine.php';          // préfixe interne: patrimoine
require __DIR__.'/modules/services-techniques.php'; // préfixe interne: st
require __DIR__.'/modules/urbanisme.php';           // préfixe interne: urb
require __DIR__.'/modules/rh-demandes.php';         // préfixe interne: rh-demandes (demandes internes -> RH)
