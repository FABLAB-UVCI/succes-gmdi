<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class TravauxBatiment extends Model
{
    protected $fillable = ['batiment','description','type','date_debut','date_fin','cout_estime','prestataire','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date','cout_estime' => 'float'];
}
