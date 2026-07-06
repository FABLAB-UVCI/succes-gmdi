<?php

namespace App\Modules\EtatCivil\Models;

use Illuminate\Database\Eloquent\Model;

class Naissance extends Model
{
    protected $fillable = [
        'numero', 'nom', 'prenom', 'date_naissance', 'heure_naissance',
        'sexe', 'lieu_naissance', 'commune',
        'pere_nom', 'pere_profession', 'pere_nationalite',
        'mere_nom', 'mere_profession', 'mere_nationalite',
        'type', 'tribunal', 'date_jugement', 'statut',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_jugement' => 'date',
    ];
}
