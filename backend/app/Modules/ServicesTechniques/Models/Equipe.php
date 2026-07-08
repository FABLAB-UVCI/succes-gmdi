<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;

class Equipe extends Model
{
    protected $fillable = ['nom','chef','membres','bon_en_cours','localisation','statut'];
    protected $casts    = ['membres' => 'integer'];
}
