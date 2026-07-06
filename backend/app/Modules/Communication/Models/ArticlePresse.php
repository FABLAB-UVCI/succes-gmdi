<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class ArticlePresse extends Model {
    protected $table    = 'articles_presse';
    protected $fillable = ['date','media','titre','type','tonalite'];
    protected $casts    = ['date'=>'date'];
}
