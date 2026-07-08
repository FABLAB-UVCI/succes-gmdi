<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceCorrective extends Model
{
    protected $fillable = ['equipement','service','panne','priorite','technicien','date_signalement','date_resolution','cout_reel','statut'];
    protected $casts    = ['date_signalement' => 'date','date_resolution' => 'date','cout_reel' => 'float'];
}
