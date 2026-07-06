<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class MobilierController extends Controller
{
    public function store(Request $request)
    {
        $v = $request->validate([
            'designation'      => 'required|string|max:200',
            'quantite'         => 'nullable|integer|min:1',
            'valeur_unitaire'  => 'nullable|numeric|min:0',
            'localisation'     => 'required|string|max:200',
            'date_acquisition' => 'nullable|date',
            'etat'             => 'nullable|string|max:30',
        ]);

        $ref = 'PAT-MOB-' . str_pad(Bien::where('categorie', 'mobilier')->count() + 1, 3, '0', STR_PAD_LEFT);
        $val = ($v['valeur_unitaire'] ?? 0) * ($v['quantite'] ?? 1);

        $bien = Bien::create([
            'reference'          => $ref,
            'designation'        => $v['designation'],
            'categorie'          => 'mobilier',
            'localisation'       => $v['localisation'],
            'valeur_acquisition' => $val,
            'valeur_actuelle'    => $val,
            'date_acquisition'   => $v['date_acquisition'] ?? now()->format('Y-m-d'),
            'affectation'        => $v['localisation'],
            'statut'             => 'disponible',
            'taux_amortissement' => 20,
            'qr_code'            => 'QR-' . $ref,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Mobilier enregistré — {$ref}",
            'data'    => app(BienController::class)->format($bien),
        ], 201);
    }
}
