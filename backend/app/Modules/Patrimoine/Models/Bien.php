<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  Bien — inventaire général
// ─────────────────────────────────────────────────────────────────────────────
class Bien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference', 'designation', 'categorie', 'localisation', 'superficie',
        'valeur_acquisition', 'valeur_actuelle', 'date_acquisition',
        'affectation', 'statut', 'taux_amortissement', 'qr_code',
    ];

    protected $casts = [
        'date_acquisition'    => 'date',
        'valeur_acquisition'  => 'float',
        'valeur_actuelle'     => 'float',
        'taux_amortissement'  => 'integer',
        'superficie'          => 'float',
    ];

    /** Dépréciation annuelle estimée */
    public function getDepreciationAnnuelleAttribute(): float
    {
        return $this->valeur_acquisition * ($this->taux_amortissement / 100);
    }
}
