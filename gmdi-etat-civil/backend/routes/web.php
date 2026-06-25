<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['app' => 'GMDI État Civil API', 'version' => '1.0', 'status' => 'running']);
});
