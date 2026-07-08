<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  Affectation / Mouvement
// ─────────────────────────────────────────────────────────────────────────────
class MouvementAffectation extends Model
{
    protected $table = 'mouvements_affectations';

    protected $fillable = [
        'date', 'reference', 'bien', 'origine', 'destination', 'responsable', 'motif',
    ];

    protected $casts = ['date' => 'date'];
}
