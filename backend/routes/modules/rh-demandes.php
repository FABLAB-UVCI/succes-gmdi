<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Rh\Controllers\DemandeRhController;

// Demandes internes gestionnaire -> RH. Préfixe `rh-demandes` exempté du
// filtrage par module (voir EnforceGmdiModuleAccess::SKIP_PREFIXES) : tout
// gestionnaire authentifié peut soumettre une demande, seul le service RH
// peut lister l'ensemble et statuer (vérifié dans le contrôleur).
Route::middleware('auth:sanctum')->prefix('rh-demandes')->group(function () {
    Route::get('/', [DemandeRhController::class, 'index']);
    Route::post('/', [DemandeRhController::class, 'store']);
    Route::patch('{demandeRh}/statut', [DemandeRhController::class, 'updateStatut']);
});
