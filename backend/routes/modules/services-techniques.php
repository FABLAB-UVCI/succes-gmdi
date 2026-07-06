<?php

use Illuminate\Support\Facades\Route;
use App\Modules\ServicesTechniques\Controllers\VoirieController;
use App\Modules\ServicesTechniques\Controllers\EclairageController;
use App\Modules\ServicesTechniques\Controllers\EauAssainissementController;
use App\Modules\ServicesTechniques\Controllers\BatimentController;
use App\Modules\ServicesTechniques\Controllers\InterventionController;
use App\Modules\ServicesTechniques\Controllers\MaintenanceController;
use App\Modules\ServicesTechniques\Controllers\StatsSTController;

Route::middleware('auth:sanctum')->group(function () {

    // ── Voirie ────────────────────────────────────────────────────────────
    Route::prefix('st/voirie')->group(function () {
        Route::get('routes',                   [VoirieController::class, 'indexRoutes']);
        Route::post('routes',                  [VoirieController::class, 'storeRoute']);
        Route::put('routes/{id}',              [VoirieController::class, 'updateRoute']);
        Route::get('entretiens',               [VoirieController::class, 'indexEntretiens']);
        Route::post('entretiens',              [VoirieController::class, 'storeEntretien']);
        Route::patch('entretiens/{id}/terminer',[VoirieController::class, 'terminerEntretien']);
        Route::get('reparations',              [VoirieController::class, 'indexReparations']);
        Route::post('reparations',             [VoirieController::class, 'storeReparation']);
        Route::patch('reparations/{id}/intervenir',[VoirieController::class, 'intervenirReparation']);
    });

    // ── Éclairage public ──────────────────────────────────────────────────
    Route::prefix('st/eclairage')->group(function () {
        Route::get('lampadaires',                    [EclairageController::class, 'indexLampadaires']);
        Route::post('lampadaires',                   [EclairageController::class, 'storeLampadaire']);
        Route::patch('lampadaires/{id}/statut',      [EclairageController::class, 'updateStatutLampadaire']);
        Route::get('pannes',                         [EclairageController::class, 'indexPannes']);
        Route::post('pannes',                        [EclairageController::class, 'storePanne']);
        Route::patch('pannes/{id}/resoudre',         [EclairageController::class, 'resoudrePanne']);
        Route::get('maintenance',                    [EclairageController::class, 'indexMaintenance']);
        Route::post('maintenance',                   [EclairageController::class, 'storeMaintenance']);
    });

    // ── Eau & Assainissement ──────────────────────────────────────────────
    Route::prefix('st/eau')->group(function () {
        Route::get('caniveaux',                       [EauAssainissementController::class, 'indexCaniveaux']);
        Route::post('caniveaux',                      [EauAssainissementController::class, 'storeCaniveau']);
        Route::patch('caniveaux/{id}/nettoyage',      [EauAssainissementController::class, 'nettoyageCaniveau']);
        Route::get('drainage',                        [EauAssainissementController::class, 'indexDrainage']);
        Route::post('drainage',                       [EauAssainissementController::class, 'storeDrainage']);
        Route::get('dechets',                         [EauAssainissementController::class, 'indexDechets']);
        Route::post('dechets',                        [EauAssainissementController::class, 'storeDechet']);
        Route::patch('dechets/{id}/effectuer',        [EauAssainissementController::class, 'effectuerCollecte']);
    });

    // ── Bâtiments communaux ───────────────────────────────────────────────
    Route::prefix('st/batiments')->group(function () {
        Route::get('/',                        [BatimentController::class, 'index']);
        Route::post('/',                       [BatimentController::class, 'store']);
        Route::put('/{id}',                    [BatimentController::class, 'update']);
        Route::get('/travaux',                 [BatimentController::class, 'indexTravaux']);
        Route::post('/travaux',                [BatimentController::class, 'storeTravaux']);
        Route::patch('/travaux/{id}/statut',   [BatimentController::class, 'updateStatutTravaux']);
    });

    // ── Interventions ─────────────────────────────────────────────────────
    Route::prefix('st/interventions')->group(function () {
        Route::get('demandes',                        [InterventionController::class, 'indexDemandes']);
        Route::post('demandes',                       [InterventionController::class, 'storeDemande']);
        Route::patch('demandes/{id}/assigner',        [InterventionController::class, 'assignerDemande']);
        Route::patch('demandes/{id}/cloturer',        [InterventionController::class, 'cloturerDemande']);
        Route::get('bons',                            [InterventionController::class, 'indexBons']);
        Route::post('bons',                           [InterventionController::class, 'storeBon']);
        Route::patch('bons/{id}/terminer',            [InterventionController::class, 'terminerBon']);
        Route::get('equipes',                         [InterventionController::class, 'indexEquipes']);
        Route::post('equipes',                        [InterventionController::class, 'storeEquipe']);
    });

    // ── Maintenance ───────────────────────────────────────────────────────
    Route::prefix('st/maintenance')->group(function () {
        Route::get('planning',                        [MaintenanceController::class, 'indexPlanning']);
        Route::post('planning',                       [MaintenanceController::class, 'storePlanning']);
        Route::patch('planning/{id}/valider',         [MaintenanceController::class, 'validerPlanning']);
        Route::get('corrective',                      [MaintenanceController::class, 'indexCorrective']);
        Route::post('corrective',                     [MaintenanceController::class, 'storeCorrective']);
        Route::patch('corrective/{id}/resoudre',      [MaintenanceController::class, 'resoudreCorrective']);
    });

    // ── Statistiques & export ─────────────────────────────────────────────
    Route::get('st/statistiques', [StatsSTController::class, 'dashboard']);
    Route::get('st/export',       [StatsSTController::class, 'export']);
});
