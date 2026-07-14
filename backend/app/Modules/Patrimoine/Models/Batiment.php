<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  Batiment — bâtiments communaux
// ─────────────────────────────────────────────────────────────────────────────
class Batiment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nom', 'superficie', 'valeur_actuelle', 'affectation', 'etat', 'derniere_inspection',
    ];

    protected $casts = [
        'superficie'          => 'float',
        'valeur_actuelle'     => 'float',
        'derniere_inspection' => 'date',
    ];
}
