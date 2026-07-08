<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class PanneEclairage extends Model
{
    protected $fillable = ['reference','localisation','description','date_signalement','technicien','date_resolution','statut'];
    protected $casts    = ['date_signalement' => 'date','date_resolution' => 'date'];
}
