<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  Terrain
// ─────────────────────────────────────────────────────────────────────────────
class Terrain extends Model
{
    use HasFactory;

    protected $fillable = [
        'localisation', 'superficie', 'valeur',
        'usage', 'titre_foncier', 'date_acquisition', 'statut',
    ];

    protected $casts = [
        'date_acquisition' => 'date',
        'superficie'       => 'float',
        'valeur'           => 'float',
    ];
}
