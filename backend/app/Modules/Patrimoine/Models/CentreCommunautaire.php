<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  CentreCommunautaire
// ─────────────────────────────────────────────────────────────────────────────
class CentreCommunautaire extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'centres_communautaires';

    protected $fillable = [
        'nom', 'quartier', 'capacite', 'services', 'statut',
    ];

    protected $casts = [
        'capacite' => 'integer',
    ];
}
