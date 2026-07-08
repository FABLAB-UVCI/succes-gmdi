<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Communication\Controllers\ActualiteController;
use App\Modules\Communication\Controllers\ReseauxController;
use App\Modules\Communication\Controllers\RelationsController;
use App\Modules\Communication\Controllers\DocumentController;
use App\Modules\Communication\Controllers\CitoyenController;
use App\Modules\Communication\Controllers\SmsController;
use App\Modules\Communication\Controllers\StatsController;

// ── Auth publique ─────────────────────────────────────────────────────────────
// ── Routes protégées Sanctum ──────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('com')->group(function () {

        // ── Actualités ────────────────────────────────────────────────────────
        Route::get('actualites',              [ActualiteController::class, 'index']);
        Route::post('actualites',             [ActualiteController::class, 'store']);
        Route::put('actualites/{id}',         [ActualiteController::class, 'update']);
        Route::patch('actualites/{id}/statut',[ActualiteController::class, 'updateStatut']);
        Route::delete('actualites/{id}',      [ActualiteController::class, 'destroy']);

        // ── Réseaux sociaux ───────────────────────────────────────────────────
        Route::get('reseaux/comptes',         [ReseauxController::class, 'getComptes']);
        Route::get('reseaux/calendrier',      [ReseauxController::class, 'getCalendrier']);
        Route::post('reseaux/publier',        [ReseauxController::class, 'publierPost']);
        Route::post('reseaux/calendrier',     [ReseauxController::class, 'ajouterCalendrier']);

        // ── Relations publiques ───────────────────────────────────────────────
        Route::get('relations/partenaires',         [RelationsController::class, 'getPartenaires']);
        Route::post('relations/partenaires',        [RelationsController::class, 'createPartenaire']);
        Route::get('relations/presse',              [RelationsController::class, 'getRevuePresse']);
        Route::post('relations/presse/envoyer',     [RelationsController::class, 'envoyerDossierPresse']);
        Route::get('relations/medias',              [RelationsController::class, 'getMedias']);

        // ── Documents ─────────────────────────────────────────────────────────
        Route::get('documents',               [DocumentController::class, 'index']);
        Route::post('documents',              [DocumentController::class, 'store']);
        Route::get('documents/type/{type}',   [DocumentController::class, 'byType']);

        // ── Réclamations ──────────────────────────────────────────────────────
        Route::get('citoyens/reclamations',                  [CitoyenController::class, 'indexReclamations']);
        Route::post('citoyens/reclamations',                 [CitoyenController::class, 'storeReclamation']);
        Route::patch('citoyens/reclamations/{id}/statut',    [CitoyenController::class, 'updateStatutReclamation']);
        Route::get('citoyens/reclamations/export',           [CitoyenController::class, 'exportReclamations']);

        // ── Suggestions ───────────────────────────────────────────────────────
        Route::get('citoyens/suggestions',                   [CitoyenController::class, 'indexSuggestions']);
        Route::post('citoyens/suggestions',                  [CitoyenController::class, 'storeSuggestion']);
        Route::patch('citoyens/suggestions/{id}/transmettre',[CitoyenController::class, 'transmettresuggestion']);

        // ── Consultations publiques ───────────────────────────────────────────
        Route::get('citoyens/consultations',  [CitoyenController::class, 'indexConsultations']);
        Route::post('citoyens/consultations', [CitoyenController::class, 'storeConsultation']);

        // ── SMS ───────────────────────────────────────────────────────────────
        Route::get('sms/historique',          [SmsController::class, 'getHistorique']);
        Route::post('sms/campagne',           [SmsController::class, 'lancerCampagne']);
        Route::post('sms/alerte',             [SmsController::class, 'envoyerAlerte']);
        Route::get('sms/export',              [SmsController::class, 'export']);

        // ── Statistiques ──────────────────────────────────────────────────────
        Route::get('statistiques',            [StatsController::class, 'dashboard']);
    });
});
