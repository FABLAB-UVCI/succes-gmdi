<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Communication\Controllers\CitoyenCommunicationController;
use App\Modules\Communication\Controllers\AbonnementController;

// Routes de lecture / abonnement destinées au portail citoyen.
// Montées sous /api/citoyen — préfixe volontairement absent de
// GmdiAccess::resolveModuleFromPath et listé dans EnforceGmdiModuleAccess::SKIP_PREFIXES,
// car il ne s'agit pas d'une gestion interne d'un module mais d'un accès
// d'information public pour le citoyen connecté.
Route::middleware('auth:sanctum')->prefix('citoyen')->group(function () {
    Route::prefix('communication')->group(function () {
        Route::get('actualites',       [CitoyenCommunicationController::class, 'actualites']);
        Route::get('agenda',           [CitoyenCommunicationController::class, 'agenda']);
        Route::get('deliberations',    [CitoyenCommunicationController::class, 'deliberations']);
        Route::get('budget-simplifie', [CitoyenCommunicationController::class, 'budgetSimplifie']);
        Route::get('alertes',          [CitoyenCommunicationController::class, 'alertes']);
        Route::post('abonnements',     [AbonnementController::class, 'store']);
    });
});
