<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneBudget extends Model
{
    use HasFactory;

    protected $table = 'lignes_budget';

    protected $fillable = [
        'chapitre', 'article', 'designation',
        'montant_previsionnel', 'montant_consomme', 'statut',
    ];

    protected $casts = ['montant_previsionnel' => 'float', 'montant_consomme' => 'float'];

    public function toArray()
    {
        $arr = parent::toArray();
        return [
            'id'                  => (string) $arr['id'],
            'chapitre'            => $arr['chapitre'],
            'article'             => $arr['article'],
            'designation'         => $arr['designation'],
            'montantPrevisionnel' => (float) $arr['montant_previsionnel'],
            'montantConsomme'     => (float) $arr['montant_consomme'],
            'statut'              => $arr['statut'],
        ];
    }
}
