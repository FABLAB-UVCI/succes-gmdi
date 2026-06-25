<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificatController;
use App\Http\Controllers\DecesController;
use App\Http\Controllers\MariageController;
use App\Http\Controllers\NaissanceController;
use App\Http\Controllers\StatistiquesController;
use Illuminate\Support\Facades\Route;

// Auth (public)
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('naissances', NaissanceController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::apiResource('mariages', MariageController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('deces', DecesController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('certificats', CertificatController::class)->only(['index', 'store', 'destroy']);
    Route::get('/statistiques', [StatistiquesController::class, 'index']);
});
