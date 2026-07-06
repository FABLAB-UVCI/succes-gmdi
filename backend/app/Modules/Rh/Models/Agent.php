<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $fillable = [
        'matricule', 'nom_complet', 'nom', 'prenom', 'poste', 'direction',
        'type_contrat', 'categorie', 'specialite', 'grade',
        'date_embauche', 'date_naissance', 'genre', 'telephone', 'email',
        'statut', 'salaire_brut', 'conges_restants', 'situation_familiale', 'diplome',
    ];

    protected $casts = [
        'date_embauche'   => 'date:Y-m-d',
        'date_naissance'  => 'date:Y-m-d',
        'salaire_brut'    => 'float',
        'conges_restants' => 'integer',
    ];
}
