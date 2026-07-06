<?php

use App\Modules\Finances\Controllers\BudgetController;
use App\Modules\Finances\Controllers\ComptabiliteController;
use App\Modules\Finances\Controllers\DashboardController;
use App\Modules\Finances\Controllers\DepenseController;
use App\Modules\Finances\Controllers\RapportController;
use App\Modules\Finances\Controllers\RecetteController;
use App\Modules\Finances\Controllers\TresorerieController;
use Illuminate\Support\Facades\Route;

// ── Authentification (public) ─────────────────────────────────────

// ── Routes protégées (Sanctum) ────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {


    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Recettes
    Route::get('/recettes',              [RecetteController::class, 'index']);
    Route::post('/recettes',             [RecetteController::class, 'store']);
    Route::patch('/recettes/{id}/encaisser', [RecetteController::class, 'encaisser']);

    // Dépenses
    Route::get('/depenses',              [DepenseController::class, 'index']);
    Route::post('/depenses',             [DepenseController::class, 'store']);
    Route::patch('/depenses/{id}/payer', [DepenseController::class, 'payer']);

    // Budget
    Route::get('/budget/lignes',              [BudgetController::class, 'lignes']);
    Route::post('/budget/lignes',             [BudgetController::class, 'ajouterLigne']);
    Route::post('/budget/revisions',          [BudgetController::class, 'revision']);
    Route::get('/budget/execution-mensuelle', [BudgetController::class, 'executionMensuelle']);

    // Comptabilité
    Route::get('/comptabilite/ecritures',  [ComptabiliteController::class, 'ecritures']);
    Route::post('/comptabilite/ecritures', [ComptabiliteController::class, 'ajouterEcriture']);
    Route::get('/comptabilite/comptes',    [ComptabiliteController::class, 'comptes']);

    // Trésorerie
    Route::get('/tresorerie/mouvements-caisse', [TresorerieController::class, 'mouvementsCaisse']);
    Route::get('/tresorerie/mouvements-banque', [TresorerieController::class, 'mouvementsBanque']);

    // Rapports
    Route::get('/rapports/recettes-par-service',  [RapportController::class, 'recettesParService']);
    Route::get('/rapports/situation-financiere',  [RapportController::class, 'situationFinanciere']);
});
