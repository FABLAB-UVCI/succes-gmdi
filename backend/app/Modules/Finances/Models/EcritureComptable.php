<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EcritureComptable extends Model
{
    use HasFactory;

    protected $table = 'ecritures_comptables';

    protected $fillable = [
        'numero', 'date', 'journal', 'libelle',
        'compte', 'debit', 'credit', 'piece',
    ];

    protected $casts = ['debit' => 'float', 'credit' => 'float', 'date' => 'date'];

    public function toArray()
    {
        return [
            'numero'  => $this->numero,
            'date'    => $this->date?->format('Y-m-d'),
            'journal' => $this->journal,
            'libelle' => $this->libelle,
            'compte'  => $this->compte,
            'debit'   => (float) $this->debit,
            'credit'  => (float) $this->credit,
            'piece'   => $this->piece,
        ];
    }
}
