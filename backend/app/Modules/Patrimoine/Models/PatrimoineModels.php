<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

// ─────────────────────────────────────────────────────────────────────────────
//  Bien — inventaire général
// ─────────────────────────────────────────────────────────────────────────────
class Bien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference', 'designation', 'categorie', 'localisation', 'superficie',
        'valeur_acquisition', 'valeur_actuelle', 'date_acquisition',
        'affectation', 'statut', 'taux_amortissement', 'qr_code',
    ];

    protected $casts = [
        'date_acquisition'    => 'date',
        'valeur_acquisition'  => 'float',
        'valeur_actuelle'     => 'float',
        'taux_amortissement'  => 'integer',
        'superficie'          => 'float',
    ];

    /** Dépréciation annuelle estimée */
    public function getDepreciationAnnuelleAttribute(): float
    {
        return $this->valeur_acquisition * ($this->taux_amortissement / 100);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Vehicule
// ─────────────────────────────────────────────────────────────────────────────
class Vehicule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'modele', 'immatriculation', 'kilometrage',
        'affectation', 'statut', 'valeur',
        'fin_assurance', 'fin_visite_technique',
    ];

    protected $casts = [
        'fin_assurance'        => 'date',
        'fin_visite_technique' => 'date',
        'valeur'               => 'float',
        'kilometrage'          => 'integer',
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Terrain
// ─────────────────────────────────────────────────────────────────────────────
class Terrain extends Model
{
    use HasFactory;

    protected $fillable = [
        'localisation', 'superficie', 'valeur',
        'usage', 'titre_foncier', 'date_acquisition', 'statut',
    ];

    protected $casts = [
        'date_acquisition' => 'date',
        'superficie'       => 'float',
        'valeur'           => 'float',
    ];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Mobilier
// ─────────────────────────────────────────────────────────────────────────────
class Mobilier extends Model
{
    protected $fillable = ['designation', 'quantite', 'valeur_unitaire', 'localisation', 'date_acquisition', 'etat'];
    protected $casts = ['date_acquisition' => 'date', 'valeur_unitaire' => 'float', 'quantite' => 'integer'];

    public function getValeurTotaleAttribute(): float
    {
        return ($this->quantite ?? 1) * ($this->valeur_unitaire ?? 0);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Informatique
// ─────────────────────────────────────────────────────────────────────────────
class Informatique extends Model
{
    protected $fillable = ['type', 'marque', 'modele', 'numero_serie', 'affectation', 'valeur_acquisition', 'date_acquisition', 'statut'];
    protected $casts = ['date_acquisition' => 'date', 'valeur_acquisition' => 'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Equipement
// ─────────────────────────────────────────────────────────────────────────────
class Equipement extends Model
{
    protected $fillable = ['designation', 'marque', 'numero_serie', 'localisation', 'valeur_acquisition', 'taux_amortissement', 'date_acquisition', 'statut'];
    protected $casts = ['date_acquisition' => 'date', 'valeur_acquisition' => 'float', 'taux_amortissement' => 'integer'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Affectation / Mouvement
// ─────────────────────────────────────────────────────────────────────────────
class MouvementAffectation extends Model
{
    protected $table = 'mouvements_affectations';

    protected $fillable = [
        'date', 'reference', 'bien', 'origine', 'destination', 'responsable', 'motif',
    ];

    protected $casts = ['date' => 'date'];
}

class Affectation extends Model
{
    protected $table = 'mouvements_affectations';

    protected $fillable = [
        'date', 'reference', 'bien', 'origine', 'destination', 'responsable', 'motif',
    ];

    protected $casts = ['date' => 'date'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Entretien
// ─────────────────────────────────────────────────────────────────────────────
class Entretien extends Model
{
    protected $fillable = ['bien', 'type_entretien', 'date_prevue', 'date_realise', 'periodicite', 'cout_estime', 'statut'];
    protected $casts = ['date_prevue' => 'date', 'date_realise' => 'date', 'cout_estime' => 'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Reparation
// ─────────────────────────────────────────────────────────────────────────────
class Reparation extends Model
{
    protected $fillable = ['bien', 'description', 'priorite', 'prestataire', 'cout_estime', 'cout_reel', 'statut', 'date_declaration', 'date_resolue'];
    protected $casts = ['date_declaration' => 'date', 'date_resolue' => 'date', 'cout_estime' => 'float', 'cout_reel' => 'float'];
}

// ─────────────────────────────────────────────────────────────────────────────
//  Amortissement
// ─────────────────────────────────────────────────────────────────────────────
class Amortissement extends Model
{
    protected $fillable = ['bien', 'valeur_acquisition', 'taux_annuel', 'annee_debut', 'amortissement_cumule', 'valeur_nette_comptable'];
    protected $casts = ['valeur_acquisition' => 'float', 'amortissement_cumule' => 'float', 'valeur_nette_comptable' => 'float', 'taux_annuel' => 'integer', 'annee_debut' => 'integer'];

    /** Recalcule la VNC en fonction du taux et de l'année de début */
    public function recalculer(): void
    {
        $annees = now()->year - $this->annee_debut;
        $cumul  = min($this->valeur_acquisition, $this->valeur_acquisition * ($this->taux_annuel / 100) * $annees);
        $this->amortissement_cumule    = $cumul;
        $this->valeur_nette_comptable  = max(0, $this->valeur_acquisition - $cumul);
        $this->save();
    }
}
