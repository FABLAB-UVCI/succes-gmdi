<?php

namespace App\Modules\Communication\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Abonnement extends Model
{
    public const STATUTS = ['en_attente', 'actif', 'refuse', 'suspendu'];

    protected $fillable = [
        'user_id', 'nom', 'prenom', 'email', 'telephone', 'type_communication', 'statut',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
