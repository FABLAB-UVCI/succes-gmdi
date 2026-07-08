<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  PERMIS & AUTORISATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Table : permis */
class Permis extends Model
{
    protected $fillable = [
        'reference','type','demandeur','telephone','localisation','quartier',
        'ilot','lot','section','numero_piece','type_piece',
        'surface_plancher','nombre_etages','cout_estime','date_depot','date_instruction','date_decision',
        'date_expiration','statut','agent','instructeur','motif_refus','observations','lat','lng',
    ];
    protected $casts    = ['date_depot'=>'date','date_instruction'=>'date','date_decision'=>'date','date_expiration'=>'date','surface_plancher'=>'float','cout_estime'=>'float','nombre_etages'=>'integer','lat'=>'float','lng'=>'float'];
}
