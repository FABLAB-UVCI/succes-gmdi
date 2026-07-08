<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  MAINTENANCE
// ─────────────────────────────────────────────────────────────────────────────
class PlanningMaintenance extends Model
{
    protected $fillable = ['equipement','service','type_maintenance','date_prevue','periodicite','responsable','cout_estime','statut','date_realisation'];
    protected $casts    = ['date_prevue' => 'date','date_realisation' => 'date','cout_estime' => 'float'];
}
