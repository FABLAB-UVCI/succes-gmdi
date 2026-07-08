<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : titre_fonciers */
class TitreFoncier extends Model
{
    protected $table    = 'titre_fonciers';
    protected $fillable = ['numero','type','proprietaire','superficie','localisation','date_delivrance','date_expiration','statut','observation','lat','lng'];
    protected $casts    = ['date_delivrance'=>'date','date_expiration'=>'date','superficie'=>'float','lat'=>'float','lng'=>'float'];
}
