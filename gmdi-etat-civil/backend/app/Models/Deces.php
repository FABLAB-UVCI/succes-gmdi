<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deces extends Model
{
    protected $table = 'deces';

    protected $fillable = [
        'numero', 'nom', 'prenom', 'date_naissance', 'date_deces',
        'heure_deces', 'lieu_deces', 'commune',
        'cause_deces', 'declarant_nom', 'declarant_lien', 'statut',
    ];

    protected $casts = [
        'date_naissance' => 'date',
        'date_deces' => 'date',
    ];
}
