<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  Reparation
// ─────────────────────────────────────────────────────────────────────────────
class Reparation extends Model
{
    protected $fillable = ['bien', 'description', 'priorite', 'prestataire', 'cout_estime', 'cout_reel', 'statut', 'date_declaration', 'date_resolue'];
    protected $casts = ['date_declaration' => 'date', 'date_resolue' => 'date', 'cout_estime' => 'float', 'cout_reel' => 'float'];
}
