<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Depense extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'objet', 'fournisseur', 'montant',
        'chapitre', 'article', 'date_engagement', 'description',
        'statut', 'date_paiement',
    ];

    protected $casts = ['montant' => 'float', 'date_engagement' => 'date', 'date_paiement' => 'date'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($d) {
            if (!$d->reference) {
                $count = static::count() + 143;
                $d->reference = 'DEP-' . date('Y') . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);
            }
        });
    }

    public function toArray()
    {
        $arr = parent::toArray();
        return [
            'id'             => (string) $arr['id'],
            'reference'      => $arr['reference'],
            'objet'          => $arr['objet'],
            'fournisseur'    => $arr['fournisseur'],
            'montant'        => (float) $arr['montant'],
            'chapitre'       => $arr['chapitre'],
            'article'        => $arr['article'],
            'dateEngagement' => $this->date_engagement?->format('Y-m-d'),
            'description'    => $arr['description'],
            'statut'         => $arr['statut'],
            'datePaiement'   => $this->date_paiement?->format('Y-m-d'),
        ];
    }
}
