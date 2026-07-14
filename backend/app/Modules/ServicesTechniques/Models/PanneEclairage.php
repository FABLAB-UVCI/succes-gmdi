<?php

namespace App\Modules\ServicesTechniques\Models;

use App\Modules\ServicesTechniques\Models\Concerns\HasSequentialReference;
use Illuminate\Database\Eloquent\Model;

class PanneEclairage extends Model
{
    use HasSequentialReference;

    protected $fillable = ['reference','localisation','description','date_signalement','technicien','date_resolution','statut'];
    protected $casts    = ['date_signalement' => 'date','date_resolution' => 'date'];
}
