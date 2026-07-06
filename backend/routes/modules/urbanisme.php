<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Urbanisme\Controllers\FoncierController;
use App\Modules\Urbanisme\Controllers\PermisController;
use App\Modules\Urbanisme\Controllers\SigController;
use App\Modules\Urbanisme\Controllers\ProjetsController;
use App\Modules\Urbanisme\Controllers\EquipementController;
use App\Modules\Urbanisme\Controllers\StatsUrbanismeController;

// ── Auth publique ─────────────────────────────────────────────────────────────
// ── Routes protégées ──────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('urb')->group(function () {

        // ════════════════════════════════════════════════════════════════════
        //  FONCIER — routes directes + alias sous /foncier/
        // ════════════════════════════════════════════════════════════════════
        foreach (['parcelles', 'foncier/parcelles'] as $path) {
            Route::get( $path,              [FoncierController::class, 'indexParcelles']);
            Route::post($path,              [FoncierController::class, 'storeParcelle']);
        }
        foreach (['parcelles/{id}', 'foncier/parcelles/{id}'] as $path) {
            Route::get(  $path,             [FoncierController::class, 'showParcelle']);
            Route::put(  $path,             [FoncierController::class, 'updateParcelle']);
        }
        foreach (['parcelles/{id}/statut', 'foncier/parcelles/{id}/statut'] as $path) {
            Route::patch($path,             [FoncierController::class, 'updateStatutParcelle']);
        }

        foreach (['lots', 'foncier/lots'] as $path) {
            Route::get( $path,              [FoncierController::class, 'indexLots']);
            Route::post($path,              [FoncierController::class, 'storeLot']);
        }
        foreach (['lots/{id}', 'foncier/lots/{id}'] as $path) {
            Route::put($path,               [FoncierController::class, 'updateLot']);
        }
        foreach (['lots/{id}/attribuer', 'foncier/lots/{id}/attribuer'] as $path) {
            Route::patch($path,             [FoncierController::class, 'attribuerLot']);
        }

        foreach (['titres', 'foncier/titres'] as $path) {
            Route::get( $path,              [FoncierController::class, 'indexTitres']);
            Route::post($path,              [FoncierController::class, 'storeTitre']);
        }
        foreach (['titres/{id}', 'foncier/titres/{id}'] as $path) {
            Route::put($path,               [FoncierController::class, 'updateTitre']);
        }

        foreach (['reserves', 'foncier/reserves'] as $path) {
            Route::get( $path,              [FoncierController::class, 'indexReserves']);
            Route::post($path,              [FoncierController::class, 'storeReserve']);
        }
        foreach (['reserves/{id}', 'foncier/reserves/{id}'] as $path) {
            Route::put($path,               [FoncierController::class, 'updateReserve']);
        }

        // ════════════════════════════════════════════════════════════════════
        //  PERMIS — sous-types AVANT le wildcard {id}
        // ════════════════════════════════════════════════════════════════════

        // Permis de construire
        Route::get( 'permis/construire',                    [PermisController::class, 'indexConstruit']);
        Route::post('permis/construire',                    [PermisController::class, 'storeConstruit']);
        Route::patch('permis/construire/{id}/instruire',    [PermisController::class, 'instruire']);
        Route::patch('permis/construire/{id}/decider',      [PermisController::class, 'decider']);

        // Permis de démolir
        Route::get( 'permis/demolir',                       [PermisController::class, 'indexDemolir']);
        Route::post('permis/demolir',                       [PermisController::class, 'storeDemolir']);
        Route::patch('permis/demolir/{id}/decider',         [PermisController::class, 'decider']);

        // Certificats d'urbanisme
        Route::get( 'permis/certificats',                   [PermisController::class, 'indexCertificat']);
        Route::post('permis/certificats',                   [PermisController::class, 'storeCertificat']);
        Route::patch('permis/certificats/{id}/delivrer',    [PermisController::class, 'delivrer']);

        // Autorisations d'occupation
        Route::get( 'permis/autorisations',                 [PermisController::class, 'indexAutorisation']);
        Route::post('permis/autorisations',                 [PermisController::class, 'storeAutorisation']);
        Route::patch('permis/autorisations/{id}/resilier',  [PermisController::class, 'resilier']);

        // Route générique permis
        Route::get( 'permis',                               [PermisController::class, 'index']);
        Route::post('permis',                               [PermisController::class, 'store']);
        Route::get( 'permis/{id}',                          [PermisController::class, 'show']);
        Route::put( 'permis/{id}',                          [PermisController::class, 'update']);
        Route::patch('permis/{id}/statut',                  [PermisController::class, 'updateStatut']);

        // ════════════════════════════════════════════════════════════════════
        //  SIG — routes directes + alias sous /sig/
        // ════════════════════════════════════════════════════════════════════
        foreach (['quartiers', 'sig/quartiers'] as $path) {
            Route::get( $path,              [SigController::class, 'indexQuartiers']);
            Route::post($path,              [SigController::class, 'storeQuartier']);
        }
        foreach (['quartiers/{id}', 'sig/quartiers/{id}'] as $path) {
            Route::put($path,               [SigController::class, 'updateQuartier']);
        }

        foreach (['voiries', 'sig/voiries'] as $path) {
            Route::get( $path,              [SigController::class, 'indexVoiries']);
            Route::post($path,              [SigController::class, 'storeVoirie']);
        }
        foreach (['voiries/{id}', 'sig/voiries/{id}'] as $path) {
            Route::put($path,               [SigController::class, 'updateVoirie']);
        }

        // Réseaux combinés (endpoint unifié attendu par le frontend)
        foreach (['reseaux', 'sig/reseaux'] as $path) {
            Route::get( $path,              [SigController::class, 'indexReseaux']);
            Route::post($path,              [SigController::class, 'storeReseau']);
        }

        // Réseaux séparés (compatibilité)
        Route::get( 'reseaux/electricite',  [SigController::class, 'indexReseauxElec']);
        Route::post('reseaux/electricite',  [SigController::class, 'storeReseauElec']);
        Route::get( 'reseaux/hydraulique',  [SigController::class, 'indexReseauxHydro']);
        Route::post('reseaux/hydraulique',  [SigController::class, 'storeReseauHydro']);

        // ════════════════════════════════════════════════════════════════════
        //  PROJETS — routes directes + alias sous /projets/
        // ════════════════════════════════════════════════════════════════════
        foreach (['lotissements', 'projets/lotissements'] as $path) {
            Route::get( $path,              [ProjetsController::class, 'indexLotissements']);
            Route::post($path,              [ProjetsController::class, 'storeLotissement']);
        }
        foreach (['lotissements/{id}', 'projets/lotissements/{id}'] as $path) {
            Route::put($path,               [ProjetsController::class, 'updateLotissement']);
        }
        foreach (['lotissements/{id}/statut', 'projets/lotissements/{id}/statut'] as $path) {
            Route::patch($path,             [ProjetsController::class, 'updateStatutLotissement']);
        }
        foreach (['lotissements/{id}/avancement', 'projets/lotissements/{id}/avancement'] as $path) {
            Route::patch($path,             [ProjetsController::class, 'updateAvancementLotissement']);
        }

        foreach (['amenagements', 'projets/amenagements'] as $path) {
            Route::get( $path,              [ProjetsController::class, 'indexAmenagements']);
            Route::post($path,              [ProjetsController::class, 'storeAmenagement']);
        }
        foreach (['amenagements/{id}', 'projets/amenagements/{id}'] as $path) {
            Route::put($path,               [ProjetsController::class, 'updateAmenagement']);
        }
        foreach (['amenagements/{id}/avancement', 'projets/amenagements/{id}/avancement'] as $path) {
            Route::patch($path,             [ProjetsController::class, 'updateAvancement']);
        }

        foreach (['chantiers', 'projets/chantiers'] as $path) {
            Route::get( $path,              [ProjetsController::class, 'indexChantiers']);
            Route::post($path,              [ProjetsController::class, 'storeChantier']);
        }
        foreach (['chantiers/{id}/avancement', 'projets/chantiers/{id}/avancement'] as $path) {
            Route::patch($path,             [ProjetsController::class, 'updateAvancement']);
        }

        // ════════════════════════════════════════════════════════════════════
        //  ÉQUIPEMENTS — routes directes + alias sous /geo/
        // ════════════════════════════════════════════════════════════════════
        foreach (['equipements', 'geo/equipements'] as $path) {
            Route::get( $path,              [EquipementController::class, 'index']);
            Route::post($path,              [EquipementController::class, 'store']);
        }
        foreach (['equipements/{id}', 'geo/equipements/{id}'] as $path) {
            Route::get($path,               [EquipementController::class, 'show']);
            Route::put($path,               [EquipementController::class, 'update']);
        }
        Route::get('equipements/type/{type}',  [EquipementController::class, 'byType']);

        // ════════════════════════════════════════════════════════════════════
        //  STATISTIQUES & EXPORT
        // ════════════════════════════════════════════════════════════════════
        Route::get('statistiques',          [StatsUrbanismeController::class, 'dashboard']);
        Route::get('export',                [StatsUrbanismeController::class, 'export']);
    });
});
