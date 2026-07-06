<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class EquipementController extends Controller
{
    public function store(Request $request)
    {
        $v = $request->validate([
            'designation'      => 'required|string|max:200',
            'marque'           => 'nullable|string|max:100',
            'numero_serie'     => 'nullable|string|max:80',
            'localisation'     => 'required|string|max:200',
            'valeur'           => 'nullable|numeric|min:0',
            'date_acquisition' => 'nullable|date',
        ]);

        $ref = 'PAT-EQP-' . str_pad(Bien::where('categorie', 'equipement')->count() + 1, 3, '0', STR_PAD_LEFT);

        $bien = Bien::create([
            'reference'          => $ref,
            'designation'        => $v['designation'],
            'categorie'          => 'equipement',
            'localisation'       => $v['localisation'],
            'valeur_acquisition' => $v['valeur'] ?? 0,
            'valeur_actuelle'    => $v['valeur'] ?? 0,
            'date_acquisition'   => $v['date_acquisition'] ?? now()->format('Y-m-d'),
            'affectation'        => $v['localisation'],
            'statut'             => 'disponible',
            'taux_amortissement' => 10,
            'qr_code'            => 'QR-' . $ref,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Équipement enregistré — {$ref}",
            'data'    => app(BienController::class)->format($bien),
        ], 201);
    }
}
