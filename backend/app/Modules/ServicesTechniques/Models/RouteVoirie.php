<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  VOIRIE
// ─────────────────────────────────────────────────────────────────────────────
class RouteVoirie extends Model
{
    protected $table    = 'routes_voirie';
    protected $fillable = ['nom','quartier','longueur','type','etat','date_dernier_entretien'];
    protected $casts    = ['date_dernier_entretien' => 'date', 'longueur' => 'float'];
}
