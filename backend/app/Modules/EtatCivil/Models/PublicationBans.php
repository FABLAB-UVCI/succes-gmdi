<?php

namespace App\Modules\EtatCivil\Models;

use Illuminate\Database\Eloquent\Model;

class PublicationBans extends Model
{
    protected $table = 'publications_bans';

    protected $fillable = [
        'numero', 'epoux_nom', 'epouse_nom',
        'date_publication', 'date_mariage_prevue', 'statut',
    ];

    protected $casts = [
        'date_publication' => 'date',
        'date_mariage_prevue' => 'date',
    ];
}
