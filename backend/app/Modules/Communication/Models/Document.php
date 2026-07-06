<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class Document extends Model {
    protected $fillable = ['titre','type','categorie','date','auteur','url','droits'];
    protected $casts    = ['date'=>'date'];
}
