<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecetteParService extends Model
{
    use HasFactory;

    protected $table = 'recettes_par_service';

    protected $fillable = ['service', 'type', 'montant', 'pct'];

    protected $casts = ['montant' => 'float', 'pct' => 'integer'];
}
