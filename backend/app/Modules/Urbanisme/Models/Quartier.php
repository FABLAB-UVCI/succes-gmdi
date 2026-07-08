<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  SIG / CARTOGRAPHIE
// ─────────────────────────────────────────────────────────────────────────────

/** Table : quartiers */
class Quartier extends Model
{
    protected $fillable = ['nom','code','superficie','population','chef','lat','lng','nombre_parcelles'];
    protected $casts    = ['superficie'=>'float','population'=>'integer','lat'=>'float','lng'=>'float','nombre_parcelles'=>'integer'];
}
