<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class Actualite extends Model {
    protected $fillable = ['type','titre','contenu','auteur','date','statut','categorie','audience'];
    protected $casts    = ['date'=>'date'];
}
