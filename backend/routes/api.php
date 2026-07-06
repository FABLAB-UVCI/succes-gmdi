<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

// Modules — état-civil
use App\Modules\EtatCivil\Controllers\NaissanceController;
use App\Modules\EtatCivil\Controllers\MariageController;
use App\Modules\EtatCivil\Controllers\DecesController;
use App\Modules\EtatCivil\Controllers\CertificatController;
use App\Modules\EtatCivil\Controllers\StatistiquesController;

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
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me', [AuthController::class, 'me']);
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
        Route::apiResource('naissances', NaissanceController::class)->only(['index', 'store', 'show', 'destroy']);
        Route::apiResource('mariages', MariageController::class)->only(['index', 'store', 'destroy']);
        Route::apiResource('deces', DecesController::class)->only(['index', 'store', 'destroy']);
        Route::apiResource('certificats', CertificatController::class)->only(['index', 'store', 'destroy']);
        Route::get('statistiques', [StatistiquesController::class, 'index']);
    });

    // --- Ressources humaines ---
    Route::prefix('rh')->group(function () {
        Route::apiResource('agents', AgentController::class);
        Route::apiResource('conges', CongeController::class);
        Route::apiResource('absences', AbsenceController::class);
        Route::apiResource('recrutements', RecrutementController::class);
        Route::apiResource('formations', FormationController::class);
        Route::apiResource('departs', DepartController::class);
    });
});
