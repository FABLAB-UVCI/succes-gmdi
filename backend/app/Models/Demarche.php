<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Demarche extends Model
{
    public const STATUTS = [
        'en_attente',
        'en_cours',
        'a_completer',
        'valide',
        'refuse',
        'termine',
    ];

    protected $fillable = [
        'user_id',
        'reference',
        'module',
        'type_demarche',
        'statut',
        'donnees',
    ];

    protected $casts = [
        'donnees' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function generateReference(): string
    {
        do {
            $ref = 'GMDI-'.now()->format('Ymd').'-'.strtoupper(Str::random(6));
        } while (self::query()->where('reference', $ref)->exists());

        return $ref;
    }
}
