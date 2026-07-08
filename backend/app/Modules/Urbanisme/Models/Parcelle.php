<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  FONCIER
// ─────────────────────────────────────────────────────────────────────────────

/** Table : parcelles */
class Parcelle extends Model
{
    protected $fillable = ['reference','proprietaire','localisation','quartier','superficie','usage','titre_foncier','statut','lat','lng'];
    protected $casts    = ['superficie'=>'float','lat'=>'float','lng'=>'float'];
}
