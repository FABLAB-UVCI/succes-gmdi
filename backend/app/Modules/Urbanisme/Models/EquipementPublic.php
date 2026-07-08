<?php

namespace App\Modules\Urbanisme\Models;

use Illuminate\Database\Eloquent\Model;

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
