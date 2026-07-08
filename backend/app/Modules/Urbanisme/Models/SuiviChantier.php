<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : suivi_chantiers */
class SuiviChantier extends Model
{
    protected $fillable = ['projet','entrepreneur','date_ouverture','date_prevue_fin','taux_avancement','derniere_visite','date_visite','statut','observations','recommandations','controleur'];
    protected $casts    = ['date_ouverture'=>'date','date_prevue_fin'=>'date','derniere_visite'=>'date','date_visite'=>'date','taux_avancement'=>'integer'];
}
