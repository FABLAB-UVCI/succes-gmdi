<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Recrutement extends Model
{
    protected $fillable = ['poste', 'direction', 'nb_postes', 'type', 'diplome_requis', 'salaire_propose', 'cloture', 'candidatures', 'statut'];

    protected $casts = [
        'cloture'         => 'date:Y-m-d',
        'nb_postes'       => 'integer',
        'candidatures'    => 'integer',
        'salaire_propose' => 'float',
    ];
}
