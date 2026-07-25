<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'titre', 'message', 'type', 'icone', 'lu', 'demarche_id'
    ];

    protected $casts = [
        'lu' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function demarche(): BelongsTo
    {
        return $this->belongsTo(Demarche::class);
    }
}
