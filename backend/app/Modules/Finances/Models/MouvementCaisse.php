<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MouvementCaisse extends Model
{
    use HasFactory;

    protected $table = 'mouvements_caisse';

    protected $fillable = ['date', 'libelle', 'type', 'montant', 'solde_apres'];

    protected $casts = ['montant' => 'float', 'solde_apres' => 'float', 'date' => 'date'];

    public function toArray()
    {
        return [
            'date'       => $this->date?->format('d/m/Y'),
            'libelle'    => $this->libelle,
            'type'       => $this->type,
            'montant'    => (float) $this->montant,
            'soldeApres' => (float) $this->solde_apres,
        ];
    }
}
