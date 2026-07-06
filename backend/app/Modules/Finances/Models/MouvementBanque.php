<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementBanque extends Model
{
    use HasFactory;

    protected $table = 'mouvements_banque';

    protected $fillable = ['date', 'libelle', 'debit', 'credit', 'solde'];

    protected $casts = ['debit' => 'float', 'credit' => 'float', 'solde' => 'float', 'date' => 'date'];

    public function toArray()
    {
        return [
            'date'    => $this->date?->format('d/m/Y'),
            'libelle' => $this->libelle,
            'debit'   => (float) $this->debit,
            'credit'  => (float) $this->credit,
            'solde'   => (float) $this->solde,
        ];
    }
}
