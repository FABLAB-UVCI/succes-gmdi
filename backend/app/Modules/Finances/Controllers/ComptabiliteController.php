<?php

namespace App\Modules\Finances\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Finances\Models\CompteGL;
use App\Modules\Finances\Models\EcritureComptable;
use Illuminate\Http\Request;

class ComptabiliteController extends Controller
{
    public function ecritures()
    {
        return response()->json(EcritureComptable::orderByDesc('date')->get());
    }

    public function comptes()
    {
        return response()->json(CompteGL::orderBy('compte')->get());
    }

    public function ajouterEcriture(Request $request)
    {
        $data = $request->validate([
            'journal' => 'required|string|max:50',
            'libelle' => 'required|string|max:255',
            'compte'  => 'required|string|max:20',
            'debit'   => 'required|numeric|min:0',
            'credit'  => 'required|numeric|min:0',
            'piece'   => 'nullable|string|max:50',
        ]);

        $count   = EcritureComptable::count() + 1;
        $ecriture = EcritureComptable::create([
            'numero'  => 'JR-' . str_pad($count, 3, '0', STR_PAD_LEFT),
            'date'    => now()->format('Y-m-d'),
            'journal' => $data['journal'],
            'libelle' => $data['libelle'],
            'compte'  => $data['compte'],
            'debit'   => $data['debit'],
            'credit'  => $data['credit'],
            'piece'   => $data['piece'] ?? '',
        ]);

        return response()->json($ecriture, 201);
    }
}
