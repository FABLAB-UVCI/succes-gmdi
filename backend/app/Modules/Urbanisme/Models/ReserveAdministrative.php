<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : reserve_administratives */
class ReserveAdministrative extends Model
{
    protected $fillable = ['denomination','usage','superficie','localisation','statut','administration','lat','lng'];
    protected $casts    = ['superficie'=>'float','lat'=>'float','lng'=>'float'];
}
