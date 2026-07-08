<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class ReparationVoirie extends Model
{
    protected $fillable = ['route','description','priorite','signale_par','date_signalement','date_intervention','statut'];
    protected $casts    = ['date_signalement' => 'date','date_intervention' => 'date'];
}
