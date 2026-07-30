<?php

namespace App\Modules\Rh\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class DemandeRh extends Model
{
    public const TYPES = ['augmentation', 'formation', 'materiel', 'recrutement', 'conges', 'autre'];
    public const STATUTS = ['en_attente', 'validee', 'refusee'];

    protected $table = 'demandes_rh';

    protected $fillable = [
        'reference', 'user_id', 'demandeur_nom', 'module_origine', 'type_demande',
        'titre', 'description', 'montant_demande', 'statut', 'commentaire_rh',
    ];

    protected $casts = [
        'montant_demande' => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public static function generateReference(): string
    {
        do {
            $ref = 'RH-DEM-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5));
        } while (self::query()->where('reference', $ref)->exists());

        return $ref;
    }
}
