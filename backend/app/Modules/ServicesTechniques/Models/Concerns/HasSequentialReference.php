<?php

namespace App\Modules\ServicesTechniques\Models\Concerns;

use Illuminate\Support\Facades\DB;

trait HasSequentialReference
{
    /**
     * Calcule le prochain numéro séquentiel à partir du plus grand suffixe
     * numérique déjà utilisé pour un préfixe donné, sous verrou transactionnel.
     * Un simple count()+1 peut générer deux fois la même référence après une
     * suppression ou lors de créations concurrentes.
     */
    public static function nextSequence(string $likePattern, int $pad): int
    {
        return DB::transaction(function () use ($likePattern, $pad) {
            $max = static::where('reference', 'like', $likePattern)
                ->lockForUpdate()
                ->pluck('reference')
                ->map(fn($ref) => (int) substr($ref, -$pad))
                ->max() ?? 0;

            return $max + 1;
        });
    }
}
