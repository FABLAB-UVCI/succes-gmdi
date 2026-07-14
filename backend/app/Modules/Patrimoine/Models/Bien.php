<?php

namespace App\Modules\Patrimoine\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

// ─────────────────────────────────────────────────────────────────────────────
//  Bien — inventaire général
// ─────────────────────────────────────────────────────────────────────────────
class Bien extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reference', 'designation', 'categorie', 'localisation', 'superficie',
        'valeur_acquisition', 'valeur_actuelle', 'date_acquisition',
        'affectation', 'statut', 'etat', 'taux_amortissement', 'qr_code',
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

    /**
     * Valeur nette comptable recalculée à la volée (amortissement linéaire),
     * cohérente avec AmortissementController et StatsPatrimoineController.
     * Ne dépend PAS de la colonne `valeur_actuelle`, qui n'est jamais mise à jour
     * après la création du bien.
     */
    public function getValeurActuelleCalculeeAttribute(): float
    {
        if ($this->taux_amortissement <= 0 || !$this->date_acquisition) {
            return (float) $this->valeur_acquisition;
        }
        $annees = max(0, (int) date('Y') - (int) $this->date_acquisition->format('Y'));
        $cumul  = min($this->valeur_acquisition, $this->valeur_acquisition * ($this->taux_amortissement / 100) * $annees);
        return max(0, (float) $this->valeur_acquisition - $cumul);
    }

    /**
     * Génère la prochaine référence séquentielle pour une catégorie, à partir du
     * plus grand suffixe numérique existant (y compris les biens supprimés), pour
     * éviter les collisions après une suppression (SoftDeletes) ou une création
     * concurrente — un simple count()+1 peut générer deux fois la même référence.
     */
    public static function nextReference(string $categorie, string $prefix): string
    {
        return DB::transaction(function () use ($categorie, $prefix) {
            $max = static::withTrashed()
                ->where('categorie', $categorie)
                ->where('reference', 'like', "PAT-{$prefix}-%")
                ->lockForUpdate()
                ->pluck('reference')
                ->map(fn($ref) => (int) substr($ref, strrpos($ref, '-') + 1))
                ->max() ?? 0;

            return "PAT-{$prefix}-" . str_pad($max + 1, 3, '0', STR_PAD_LEFT);
        });
    }
}
