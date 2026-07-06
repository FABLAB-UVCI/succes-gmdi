<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Depart extends Model
{
    protected $fillable = [
        'matricule', 'nom', 'cause', 'date', 'derniere_presence', 'dernier_salaire', 'observations', 'statut',
    ];

    protected $casts = [
        'date'              => 'date:Y-m-d',
        'derniere_presence' => 'date:Y-m-d',
        'dernier_salaire'   => 'float',
    ];
}
