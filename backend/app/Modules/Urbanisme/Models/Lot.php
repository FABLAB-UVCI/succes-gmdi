<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : lots */
class Lot extends Model
{
    protected $fillable = ['reference','lotissement','numero','superficie','usage','prix','attributaire','attribue_a','date_attribution','statut'];
    protected $casts    = ['date_attribution'=>'date','superficie'=>'float','prix'=>'float','numero'=>'integer'];
}
