<?php

namespace App\Modules\ServicesTechniques\Models;

use App\Modules\ServicesTechniques\Models\Concerns\HasSequentialReference;
use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  INTERVENTIONS
// ─────────────────────────────────────────────────────────────────────────────
class DemandeIntervention extends Model
{
    use HasSequentialReference;

    protected $fillable = ['reference','type_service','description','localisation','demandeur','telephone','date_depot','priorite','statut','assigne_a','date_assignation','date_resolution'];
    protected $casts    = ['date_depot' => 'date','date_assignation' => 'date','date_resolution' => 'date'];
}
