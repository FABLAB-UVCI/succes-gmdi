<?php

namespace App\Modules\Finances\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompteGL extends Model
{
    use HasFactory;

    protected $table = 'comptes_gl';

    protected $fillable = ['compte', 'intitule', 'debit', 'credit', 'solde'];

    protected $casts = ['debit' => 'float', 'credit' => 'float', 'solde' => 'float'];

    public function toArray()
    {
        return [
            'compte'   => $this->compte,
            'intitule' => $this->intitule,
            'debit'    => (float) $this->debit,
            'credit'   => (float) $this->credit,
            'solde'    => (float) $this->solde,
        ];
    }
}
