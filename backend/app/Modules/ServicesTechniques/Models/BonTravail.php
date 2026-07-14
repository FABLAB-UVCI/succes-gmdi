<?php

namespace App\Modules\ServicesTechniques\Models;

use App\Modules\ServicesTechniques\Models\Concerns\HasSequentialReference;
use Illuminate\Database\Eloquent\Model;

class BonTravail extends Model
{
    use HasSequentialReference;

    protected $fillable = ['reference','demande_ref','description','service','equipe','chef','date_debut','date_fin','materiaux','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date'];
}
