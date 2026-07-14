<?php

namespace App\Modules\ServicesTechniques\Models;

use App\Modules\ServicesTechniques\Models\Concerns\HasSequentialReference;
use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  ÉCLAIRAGE PUBLIC
// ─────────────────────────────────────────────────────────────────────────────
class Lampadaire extends Model
{
    use HasSequentialReference;

    protected $fillable = ['reference','localisation','quartier','type_lampe','puissance','statut','date_posee','date_dernier_controle'];
    protected $casts    = ['date_posee' => 'date','date_dernier_controle' => 'date','puissance' => 'integer'];
}
