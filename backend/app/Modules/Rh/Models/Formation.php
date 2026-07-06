<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    protected $fillable = ['titre', 'organisme', 'formateur', 'date_debut', 'date_fin', 'agents', 'cout', 'statut'];

    protected $casts = [
        'date_debut' => 'date:Y-m-d',
        'date_fin'   => 'date:Y-m-d',
        'cout'       => 'float',
    ];
}
