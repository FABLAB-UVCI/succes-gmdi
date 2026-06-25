<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificat extends Model
{
    protected $fillable = [
        'numero', 'type', 'beneficiaire_nom', 'beneficiaire_prenom',
        'acte_reference', 'demandeur_nom', 'motif',
        'date_delivrance', 'statut',
    ];

    protected $casts = [
        'date_delivrance' => 'date',
    ];
}
