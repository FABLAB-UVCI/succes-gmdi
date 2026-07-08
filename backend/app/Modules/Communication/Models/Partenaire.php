<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class Partenaire extends Model {
    protected $fillable = ['nom','nom_contact','type','domaine','contact','date_debut','statut'];
    protected $casts    = ['date_debut'=>'date'];
}
