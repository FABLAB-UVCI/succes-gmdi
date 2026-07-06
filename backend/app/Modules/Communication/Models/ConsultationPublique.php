<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class ConsultationPublique extends Model {
    protected $table    = 'consultation_publiques';
    protected $fillable = ['titre','theme','date_ouverture','date_cloture','participants','statut','canaux'];
    protected $casts    = ['date_ouverture'=>'date','date_cloture'=>'date','participants'=>'integer'];
}
