<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : reseau_electriques */
class ReseauElectrique extends Model
{
    protected $fillable = ['zone','type','longueur','taux_couverture','operateur'];
    protected $casts    = ['longueur'=>'float','taux_couverture'=>'integer'];
}
