<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;

class InformatiqueController extends Controller
{
    public function store(Request $request)
    {
        $v = $request->validate([
            'type_materiel'    => 'required|string|max:100',
            'modele'           => 'nullable|string|max:150',
            'numero_serie'     => 'nullable|string|max:80',
            'affectation'      => 'required|string|max:200',
            'valeur'           => 'nullable|numeric|min:0',
            'date_acquisition' => 'nullable|date',
        ]);

        $ref = 'PAT-INF-' . str_pad(Bien::where('categorie', 'informatique')->count() + 1, 3, '0', STR_PAD_LEFT);
        $des = trim("{$v['type_materiel']} " . ($v['modele'] ?? ''));

        $bien = Bien::create([
            'reference'          => $ref,
            'designation'        => $des,
            'categorie'          => 'informatique',
            'localisation'       => $v['affectation'],
            'valeur_acquisition' => $v['valeur'] ?? 0,
            'valeur_actuelle'    => $v['valeur'] ?? 0,
            'date_acquisition'   => $v['date_acquisition'] ?? now()->format('Y-m-d'),
            'affectation'        => $v['affectation'],
            'statut'             => 'disponible',
            'taux_amortissement' => 33,
            'qr_code'            => 'QR-' . $ref,
        ]);

        return response()->json([
            'success' => true,
            'message' => "Matériel enregistré — {$ref}",
            'data'    => app(BienController::class)->format($bien),
        ], 201);
    }
}
