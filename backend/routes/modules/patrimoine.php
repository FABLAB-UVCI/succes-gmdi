<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Patrimoine\Controllers\BienController;
use App\Modules\Patrimoine\Controllers\VehiculeController;
use App\Modules\Patrimoine\Controllers\TerrainController;
use App\Modules\Patrimoine\Controllers\MobilierController;
use App\Modules\Patrimoine\Controllers\InformatiqueController;
use App\Modules\Patrimoine\Controllers\EquipementController;
use App\Modules\Patrimoine\Controllers\AffectationController;
use App\Modules\Patrimoine\Controllers\EntretienController;
use App\Modules\Patrimoine\Controllers\ReparationController;
use App\Modules\Patrimoine\Controllers\AmortissementController;
use App\Modules\Patrimoine\Controllers\StatsPatrimoineController;

// ── Auth publique ─────────────────────────────────────────────────────────────
// ── Routes protégées ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    // ── Biens (inventaire général) ────────────────────────────────────────────
    Route::prefix('patrimoine/biens')->group(function () {
        Route::get('/',                     [BienController::class, 'index']);
        Route::post('/',                    [BienController::class, 'store']);
        Route::get('/reference/{ref}',      [BienController::class, 'findByReference']);
        Route::get('/{id}',                 [BienController::class, 'show']);
        Route::put('/{id}',                 [BienController::class, 'update']);
        Route::delete('/{id}',              [BienController::class, 'destroy']);
        Route::patch('/{id}/statut',        [BienController::class, 'updateStatut']);
        Route::get('/{id}/qr',              [BienController::class, 'qrCode']);
        Route::get('/{id}/fiche',           [BienController::class, 'fiche']); // PDF fiche
    });

    // ── Sous-catégories (enregistrement spécialisé → crée un Bien) ───────────
    Route::post('patrimoine/mobilier',      [MobilierController::class, 'store']);
    Route::post('patrimoine/informatique',  [InformatiqueController::class, 'store']);
    Route::post('patrimoine/equipements',   [EquipementController::class, 'store']);

    // ── Véhicules ─────────────────────────────────────────────────────────────
    Route::prefix('patrimoine/vehicules')->group(function () {
        Route::get('/',                     [VehiculeController::class, 'index']);
        Route::post('/',                    [VehiculeController::class, 'store']);
        Route::get('/{id}',                 [VehiculeController::class, 'show']);
        Route::put('/{id}',                 [VehiculeController::class, 'update']);
        Route::patch('/{id}/kilometrage',   [VehiculeController::class, 'updateKm']);
        Route::delete('/{id}',              [VehiculeController::class, 'destroy']);
    });

    // ── Terrains ──────────────────────────────────────────────────────────────
    Route::prefix('patrimoine/terrains')->group(function () {
        Route::get('/',       [TerrainController::class, 'index']);
        Route::post('/',      [TerrainController::class, 'store']);
        Route::get('/{id}',   [TerrainController::class, 'show']);
        Route::put('/{id}',   [TerrainController::class, 'update']);
        Route::delete('/{id}',[TerrainController::class, 'destroy']);
    });

    // ── Affectations & mouvements ─────────────────────────────────────────────
    Route::prefix('patrimoine/affectations')->group(function () {
        Route::get('/',       [AffectationController::class, 'index']);
        Route::post('/',      [AffectationController::class, 'store']);
        Route::get('/export', [AffectationController::class, 'export']);
    });

    // ── Entretiens ────────────────────────────────────────────────────────────
    Route::prefix('patrimoine/entretiens')->group(function () {
        Route::get('/',                   [EntretienController::class, 'index']);
        Route::post('/',                  [EntretienController::class, 'store']);
        Route::get('/{id}',               [EntretienController::class, 'show']);
        Route::delete('/{id}',            [EntretienController::class, 'destroy']);
        Route::patch('/{id}/valider',     [EntretienController::class, 'valider']);
    });

    // ── Réparations ───────────────────────────────────────────────────────────
    Route::prefix('patrimoine/reparations')->group(function () {
        Route::get('/',                   [ReparationController::class, 'index']);
        Route::post('/',                  [ReparationController::class, 'store']);
        Route::get('/{id}',               [ReparationController::class, 'show']);
        Route::patch('/{id}/resoudre',    [ReparationController::class, 'resoudre']);
    });

    // ── Amortissements ────────────────────────────────────────────────────────
    Route::prefix('patrimoine/amortissements')->group(function () {
        Route::get('/',        [AmortissementController::class, 'index']);
        Route::post('/simuler',[AmortissementController::class, 'simuler']);
    });

    // ── Statistiques & export ─────────────────────────────────────────────────
    Route::prefix('patrimoine')->group(function () {
        Route::get('statistiques', [StatsPatrimoineController::class, 'dashboard']);
        Route::get('export',       [StatsPatrimoineController::class, 'export']);
    });
});
