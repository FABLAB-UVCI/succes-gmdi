<?php

namespace App\Modules\ServicesTechniques\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

// ─────────────────────────────────────────────────────────────────────────────
//  User  (table : users)
// ─────────────────────────────────────────────────────────────────────────────
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    protected string $guard_name = 'sanctum';
    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden   = ['password', 'remember_token'];
    protected $casts    = ['password' => 'hashed'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  VOIRIE
// ─────────────────────────────────────────────────────────────────────────────
class RouteVoirie extends Model
{
    protected $table    = 'routes_voirie';
    protected $fillable = ['nom','quartier','longueur','type','etat','date_dernier_entretien'];
    protected $casts    = ['date_dernier_entretien' => 'date', 'longueur' => 'float'];
}

class EntretienVoirie extends Model
{
    protected $fillable = ['route','type_entretien','date_debut','date_fin','equipe','cout_estime','cout_reel','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date','cout_estime' => 'float','cout_reel' => 'float'];
}

class ReparationVoirie extends Model
{
    protected $fillable = ['route','description','priorite','signale_par','date_signalement','date_intervention','statut'];
    protected $casts    = ['date_signalement' => 'date','date_intervention' => 'date'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  ÉCLAIRAGE PUBLIC
// ─────────────────────────────────────────────────────────────────────────────
class Lampadaire extends Model
{
    protected $fillable = ['reference','localisation','quartier','type_lampe','puissance','statut','date_posee','date_dernier_controle'];
    protected $casts    = ['date_posee' => 'date','date_dernier_controle' => 'date','puissance' => 'integer'];
}

class PanneEclairage extends Model
{
    protected $fillable = ['reference','localisation','description','date_signalement','technicien','date_resolution','statut'];
    protected $casts    = ['date_signalement' => 'date','date_resolution' => 'date'];
}

class MaintenanceEclairage extends Model
{
    protected $fillable = ['zone','nb_lampadaires','type_intervention','date_prevue','technicien','statut'];
    protected $casts    = ['date_prevue' => 'date','nb_lampadaires' => 'integer'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  EAU & ASSAINISSEMENT
// ─────────────────────────────────────────────────────────────────────────────
class Caniveau extends Model
{
    protected $table    = 'caniveaux';
    protected $fillable = ['localisation','quartier','longueur','etat','date_dernier_nettoyage'];
    protected $casts    = ['date_dernier_nettoyage' => 'date','longueur' => 'float'];
}

class InterventionDrainage extends Model
{
    protected $fillable = ['localisation','type','date_intervention','equipe','statut','observations'];
    protected $casts    = ['date_intervention' => 'date'];
}

class CollecteDechet extends Model
{
    protected $fillable = ['zone','frequence','prochaine_collecte','tonnage','statut'];
    protected $casts    = ['prochaine_collecte' => 'date','tonnage' => 'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  BÂTIMENTS COMMUNAUX
// ─────────────────────────────────────────────────────────────────────────────
class BatimentCommunal extends Model
{
    protected $fillable = ['nom','type','adresse','superficie','annee_construction','etat','responsable','date_derniere_inspection'];
    protected $casts    = ['date_derniere_inspection' => 'date','superficie' => 'float','annee_construction' => 'integer'];
}

class TravauxBatiment extends Model
{
    protected $fillable = ['batiment','description','type','date_debut','date_fin','cout_estime','prestataire','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date','cout_estime' => 'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  INTERVENTIONS
// ─────────────────────────────────────────────────────────────────────────────
class DemandeIntervention extends Model
{
    protected $fillable = ['reference','type_service','description','localisation','demandeur','telephone','date_depot','priorite','statut','assigne_a','date_assignation','date_resolution'];
    protected $casts    = ['date_depot' => 'date','date_assignation' => 'date','date_resolution' => 'date'];
}

class BonTravail extends Model
{
    protected $fillable = ['reference','demande_ref','description','service','equipe','chef','date_debut','date_fin','materiaux','statut'];
    protected $casts    = ['date_debut' => 'date','date_fin' => 'date'];
}

class Equipe extends Model
{
    protected $fillable = ['nom','chef','membres','bon_en_cours','localisation','statut'];
    protected $casts    = ['membres' => 'integer'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAINTENANCE
// ─────────────────────────────────────────────────────────────────────────────
class PlanningMaintenance extends Model
{
    protected $fillable = ['equipement','service','type_maintenance','date_prevue','periodicite','responsable','cout_estime','statut','date_realisation'];
    protected $casts    = ['date_prevue' => 'date','date_realisation' => 'date','cout_estime' => 'float'];
}

class MaintenanceCorrective extends Model
{
    protected $fillable = ['equipement','service','panne','priorite','technicien','date_signalement','date_resolution','cout_reel','statut'];
    protected $casts    = ['date_signalement' => 'date','date_resolution' => 'date','cout_reel' => 'float'];
}
