<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class CollecteDechet extends Model
{
    protected $fillable = ['zone','frequence','prochaine_collecte','tonnage','statut'];
    protected $casts    = ['prochaine_collecte' => 'date','tonnage' => 'float'];
}
