<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  Marche — marchés municipaux
// ─────────────────────────────────────────────────────────────────────────────
class Marche extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom', 'superficie', 'nombre_boutiques', 'loyer_moyen_boutique', 'statut',
    ];

    protected $casts = [
        'superficie'            => 'float',
        'nombre_boutiques'      => 'integer',
        'loyer_moyen_boutique'  => 'float',
    ];

    /** Revenus mensuels estimés = boutiques × loyer moyen */
    public function getRevenusMensuelsAttribute(): float
    {
        return $this->nombre_boutiques * $this->loyer_moyen_boutique;
    }
}
