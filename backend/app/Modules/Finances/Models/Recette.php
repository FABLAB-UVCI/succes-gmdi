<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recette extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference', 'contribuable', 'adresse', 'service_emetteur',
        'operateur', 'numero_transaction', 'type_taxe', 'montant',
        'date_echeance', 'mode_paiement', 'statut', 'date_paiement',
    ];

    protected $casts = ['montant' => 'float', 'date_echeance' => 'date', 'date_paiement' => 'date'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($r) {
            if (!$r->reference) {
                $count = static::count() + 10289;
                $r->reference = 'TX-' . date('Y') . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
            }
        });
    }

    public function toArray()
    {
        $arr = parent::toArray();
        $arr['id'] = (string) $arr['id'];
        $arr['date_echeance'] = $this->date_echeance?->format('Y-m-d');
        $arr['date_paiement'] = $this->date_paiement?->format('Y-m-d');
        // Map snake_case → camelCase pour Angular
        return [
            'id'                => $arr['id'],
            'reference'         => $arr['reference'],
            'contribuable'      => $arr['contribuable'],
            'adresse'           => $arr['adresse'],
            'serviceEmetteur'   => $arr['service_emetteur'],
            'operateur'         => $arr['operateur'],
            'numeroTransaction' => $arr['numero_transaction'],
            'typeTaxe'          => $arr['type_taxe'],
            'montant'           => (float) $arr['montant'],
            'dateEcheance'      => $arr['date_echeance'],
            'modePaiement'      => $arr['mode_paiement'],
            'statut'            => $arr['statut'],
            'datePaiement'      => $arr['date_paiement'],
        ];
    }
}
