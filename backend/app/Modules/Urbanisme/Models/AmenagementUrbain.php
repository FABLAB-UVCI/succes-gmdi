<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : amenagement_urbains */
class AmenagementUrbain extends Model
{
    protected $fillable = ['intitule','type','localisation','superficie','budget','financeur','date_debut','date_fin','taux_avancement','statut'];
    protected $casts    = ['date_debut'=>'date','date_fin'=>'date','budget'=>'float','superficie'=>'float','taux_avancement'=>'integer'];
}
