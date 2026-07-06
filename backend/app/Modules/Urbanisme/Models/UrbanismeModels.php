<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

// ─────────────────────────────────────────────────────────────────────────────
//  User
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
//  FONCIER
// ─────────────────────────────────────────────────────────────────────────────

/** Table : parcelles */
class Parcelle extends Model
{
    protected $fillable = ['reference','proprietaire','localisation','quartier','superficie','usage','titre_foncier','statut','lat','lng'];
    protected $casts    = ['superficie'=>'float','lat'=>'float','lng'=>'float'];
}

/** Table : lots */
class Lot extends Model
{
    protected $fillable = ['reference','lotissement','superficie','attributaire','date_attribution','statut'];
    protected $casts    = ['date_attribution'=>'date','superficie'=>'float'];
}

/** Table : titre_fonciers */
class TitreFoncier extends Model
{
    protected $table    = 'titre_fonciers';
    protected $fillable = ['numero','type','proprietaire','superficie','localisation','date_delivrance','date_expiration','statut','observation','lat','lng'];
    protected $casts    = ['date_delivrance'=>'date','date_expiration'=>'date','superficie'=>'float','lat'=>'float','lng'=>'float'];
}

/** Table : reserve_administratives */
class ReserveAdministrative extends Model
{
    protected $fillable = ['denomination','usage','superficie','localisation','statut','administration','lat','lng'];
    protected $casts    = ['superficie'=>'float','lat'=>'float','lng'=>'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  PERMIS & AUTORISATIONS
// ─────────────────────────────────────────────────────────────────────────────

/** Table : permis */
class Permis extends Model
{
    protected $fillable = [
        'reference','type','demandeur','telephone','localisation','quartier',
        'ilot','lot','section','numero_piece','type_piece',
        'surface_plancher','date_depot','date_instruction','date_decision',
        'date_expiration','statut','agent','observations','lat','lng',
    ];
    protected $casts    = ['date_depot'=>'date','date_instruction'=>'date','date_decision'=>'date','date_expiration'=>'date','surface_plancher'=>'float','lat'=>'float','lng'=>'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  SIG / CARTOGRAPHIE
// ─────────────────────────────────────────────────────────────────────────────

/** Table : quartiers */
class Quartier extends Model
{
    protected $fillable = ['nom','code','superficie','population','chef','lat','lng','nombre_parcelles'];
    protected $casts    = ['superficie'=>'float','population'=>'integer','lat'=>'float','lng'=>'float','nombre_parcelles'=>'integer'];
}

/** Table : couche_voiries */
class CoucheVoirie extends Model
{
    protected $table    = 'couche_voiries';
    protected $fillable = ['nom','type','longueur','etat','quartier'];
    protected $casts    = ['longueur'=>'float'];
}

/** Table : reseau_electriques */
class ReseauElectrique extends Model
{
    protected $fillable = ['zone','type','longueur','taux_couverture','operateur'];
    protected $casts    = ['longueur'=>'float','taux_couverture'=>'integer'];
}

/** Table : reseau_hydrauliques */
class ReseauHydraulique extends Model
{
    protected $fillable = ['zone','type','longueur','taux_couverture','statut'];
    protected $casts    = ['longueur'=>'float','taux_couverture'=>'integer'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  PROJETS URBAINS
// ─────────────────────────────────────────────────────────────────────────────

/** Table : lotissements */
class Lotissement extends Model
{
    protected $fillable = ['reference','denomination','promoteur','localisation','superficie','nombre_lots','lots_disponibles','date_approb','statut'];
    protected $casts    = ['date_approb'=>'date','superficie'=>'float','nombre_lots'=>'integer','lots_disponibles'=>'integer'];
}

/** Table : amenagement_urbains */
class AmenagementUrbain extends Model
{
    protected $fillable = ['intitule','type','localisation','superficie','budget','financeur','date_debut','date_fin','taux_avancement','statut'];
    protected $casts    = ['date_debut'=>'date','date_fin'=>'date','budget'=>'float','superficie'=>'float','taux_avancement'=>'integer'];
}

/** Table : suivi_chantiers */
class SuiviChantier extends Model
{
    protected $fillable = ['projet','entrepreneur','date_ouverture','date_prevue_fin','taux_avancement','derniere_visite','statut','observations'];
    protected $casts    = ['date_ouverture'=>'date','date_prevue_fin'=>'date','derniere_visite'=>'date','taux_avancement'=>'integer'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  ÉQUIPEMENTS PUBLICS
// ─────────────────────────────────────────────────────────────────────────────

/** Table : equipement_publics */
class EquipementPublic extends Model
{
    protected $fillable = ['nom','type','adresse','quartier','lat','lng','capacite','etat','responsable','annee_construction'];
    protected $casts    = ['lat'=>'float','lng'=>'float','capacite'=>'integer','annee_construction'=>'integer'];

    // Types valides incluant les nouvelles catégories sécurité
    const TYPES = ['ecole','sante','marche','espace_vert','sport','culte','securite','commissariat','gendarmerie','eaux_forets','autre'];
}
