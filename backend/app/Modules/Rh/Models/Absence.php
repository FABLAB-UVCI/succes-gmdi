<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = ['matricule', 'agent', 'date', 'motif', 'justifie'];

    protected $casts = [
        'date'     => 'date:Y-m-d',
        'justifie' => 'boolean',
    ];
}
