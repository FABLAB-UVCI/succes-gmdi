<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Purge quotidienne des tokens Sanctum expirés (voir config/sanctum.php: expiration).
Schedule::command('sanctum:prune-expired --hours=24')->daily();
