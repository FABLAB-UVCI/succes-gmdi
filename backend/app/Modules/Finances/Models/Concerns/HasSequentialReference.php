<?php

namespace App\Modules\Finances\Models\Concerns;

use Illuminate\Support\Facades\DB;

trait HasSequentialReference
{
    /**
     * Calcule le prochain numéro séquentiel à partir du plus grand suffixe
     * numérique déjà utilisé pour un préfixe donné, sous verrou transactionnel.
     * Un simple count()+N peut générer deux fois la même référence après une
     * suppression ou lors de créations concurrentes.
     */
    public static function nextSequence(string $column, string $likePattern, int $pad): int
    {
        return DB::transaction(function () use ($column, $likePattern, $pad) {
            $max = static::where($column, 'like', $likePattern)
                ->lockForUpdate()
                ->pluck($column)
                ->map(fn($ref) => (int) substr($ref, -$pad))
                ->max() ?? 0;

            return $max + 1;
        });
    }
}
