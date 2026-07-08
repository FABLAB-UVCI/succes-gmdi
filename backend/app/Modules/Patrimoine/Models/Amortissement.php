<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Model;

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
