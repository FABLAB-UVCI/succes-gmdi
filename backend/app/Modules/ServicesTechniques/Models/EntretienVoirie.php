<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class EntretienVoirie extends Model
{
    protected $fillable = ['route','type_entretien','date_debut','date_fin','equipe','cout_estime','cout_reel','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date','cout_estime' => 'float','cout_reel' => 'float'];
}
