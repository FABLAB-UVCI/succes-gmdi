<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class CompteReseau extends Model {
    protected $table    = 'compte_reseaux';
    protected $fillable = ['plateforme','nom','handle','abonnes','publications','taux_engagement','porte_mois','dernier_post'];
    protected $casts    = ['abonnes'=>'integer','publications'=>'integer','taux_engagement'=>'float','porte_mois'=>'integer'];
}
