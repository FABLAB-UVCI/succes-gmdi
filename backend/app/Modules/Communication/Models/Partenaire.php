<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class Partenaire extends Model {
    protected $fillable = ['nom','type','domaine','contact','date_debut','statut'];
    protected $casts    = ['date_debut'=>'date'];
}
