<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  BÂTIMENTS COMMUNAUX
// ─────────────────────────────────────────────────────────────────────────────
class BatimentCommunal extends Model
{
    protected $fillable = ['nom','type','adresse','superficie','annee_construction','etat','responsable','date_derniere_inspection'];
    protected $casts    = ['date_derniere_inspection' => 'date','superficie' => 'float','annee_construction' => 'integer'];
}
