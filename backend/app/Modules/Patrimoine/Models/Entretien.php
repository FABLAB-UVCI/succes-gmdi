<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Model;

// ─────────────────────────────────────────────────────────────────────────────
//  Entretien
// ─────────────────────────────────────────────────────────────────────────────
class Entretien extends Model
{
    protected $fillable = ['bien', 'type_entretien', 'date_prevue', 'date_realise', 'periodicite', 'cout_estime', 'statut'];
    protected $casts = ['date_prevue' => 'date', 'date_realise' => 'date', 'cout_estime' => 'float'];
}
