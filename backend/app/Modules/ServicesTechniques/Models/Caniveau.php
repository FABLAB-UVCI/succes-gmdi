<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  EAU & ASSAINISSEMENT
// ─────────────────────────────────────────────────────────────────────────────
class Caniveau extends Model
{
    protected $table    = 'caniveaux';
    protected $fillable = ['localisation','quartier','longueur','etat','date_dernier_nettoyage'];
    protected $casts    = ['date_dernier_nettoyage' => 'date','longueur' => 'float'];
}
