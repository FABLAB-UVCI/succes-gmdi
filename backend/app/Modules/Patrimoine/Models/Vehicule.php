<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  Vehicule
// ─────────────────────────────────────────────────────────────────────────────
class Vehicule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'modele', 'immatriculation', 'kilometrage',
        'affectation', 'statut', 'valeur',
        'fin_assurance', 'fin_visite_technique',
    ];

    protected $casts = [
        'fin_assurance'        => 'date',
        'fin_visite_technique' => 'date',
        'valeur'               => 'float',
        'kilometrage'          => 'integer',
    ];
}
