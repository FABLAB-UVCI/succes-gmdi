<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

/** Table : couche_voiries */
class CoucheVoirie extends Model
{
    protected $table    = 'couche_voiries';
    protected $fillable = ['nom','type','longueur','largeur','etat','quartier'];
    protected $casts    = ['longueur'=>'float','largeur'=>'float'];
}
