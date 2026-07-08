<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class InterventionDrainage extends Model
{
    protected $fillable = ['localisation','type','date_intervention','equipe','statut','observations'];
    protected $casts    = ['date_intervention' => 'date'];
}
