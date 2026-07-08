<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  PROJETS URBAINS
// ─────────────────────────────────────────────────────────────────────────────

/** Table : lotissements */
class Lotissement extends Model
{
    protected $fillable = ['reference','denomination','promoteur','localisation','superficie','nombre_lots','lots_disponibles','date_approb','statut'];
    protected $casts    = ['date_approb'=>'date','superficie'=>'float','nombre_lots'=>'integer','lots_disponibles'=>'integer'];
}
