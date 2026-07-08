<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : reseau_hydrauliques */
class ReseauHydraulique extends Model
{
    protected $fillable = ['zone','type','longueur','taux_couverture','statut'];
    protected $casts    = ['longueur'=>'float','taux_couverture'=>'integer'];
}
