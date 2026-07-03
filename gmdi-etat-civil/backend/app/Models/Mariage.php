<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mariage extends Model
{
    protected $fillable = [
        'numero', 'epoux_nom', 'epoux_prenom', 'epoux_date_naissance',
        'epoux_nationalite', 'epoux_profession',
        'epouse_nom', 'epouse_prenom', 'epouse_date_naissance',
        'epouse_nationalite', 'epouse_profession',
        'date_mariage', 'lieu_mariage', 'commune',
        'regime_matrimonial', 'temoin1_nom', 'temoin1_profession',
        'temoin2_nom', 'temoin2_profession', 'statut',
    ];

    protected $casts = [
        'date_mariage' => 'date',
        'epoux_date_naissance' => 'date',
        'epouse_date_naissance' => 'date',
    ];
}
