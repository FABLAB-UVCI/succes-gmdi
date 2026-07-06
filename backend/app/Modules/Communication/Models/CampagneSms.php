<?php
namespace App\Modules\Communication\Models;
use Illuminate\Database\Eloquent\Model;
class CampagneSms extends Model {
    protected $table    = 'campagne_sms';
    protected $fillable = ['nom','type','message','destinataires','nb_destinataires','date_envoi','statut','taux_livraison'];
    protected $casts    = ['date_envoi'=>'date','nb_destinataires'=>'integer','taux_livraison'=>'integer'];
}
