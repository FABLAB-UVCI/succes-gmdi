<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceEclairage extends Model
{
    protected $fillable = ['zone','nb_lampadaires','type_intervention','date_prevue','technicien','statut'];
    protected $casts    = ['date_prevue' => 'date','nb_lampadaires' => 'integer'];
}
