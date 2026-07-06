<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Conge extends Model
{
    protected $fillable = [
        'matricule', 'agent', 'type', 'date_debut', 'duree', 'motif', 'piece_jointe', 'statut',
    ];

    protected $casts = [
        'date_debut' => 'date:Y-m-d',
        'duree'      => 'integer',
    ];
}
