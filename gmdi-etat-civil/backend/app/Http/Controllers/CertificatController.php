<?php

namespace App\Http\Controllers;

use App\Models\Certificat;
use Illuminate\Http\Request;

class CertificatController extends Controller
{
    public function index(Request $request)
    {
        $query = Certificat::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('beneficiaire_nom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($c) => [
            'id' => $c->id,
            'numero' => $c->numero,
            'type' => $c->type,
            'beneficiaire' => $c->beneficiaire_nom . ' ' . ($c->beneficiaire_prenom ?? ''),
            'dateDelivrance' => $c->date_delivrance?->format('d/m/Y'),
            'statut' => $c->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:Naissance,Mariage,Décès,Résidence,Vie,Célibat',
            'beneficiaire_nom' => 'required|string',
            'beneficiaire_prenom' => 'nullable|string',
            'acte_reference' => 'nullable|string',
            'demandeur_nom' => 'nullable|string',
            'motif' => 'nullable|string',
        ]);

        $data['numero'] = 'CI-CC-' . date('Y') . '-C-' . str_pad(Certificat::count() + 1, 6, '0', STR_PAD_LEFT);
        $data['date_delivrance'] = now();
        $data['statut'] = 'Délivré';

        $certificat = Certificat::create($data);

        return response()->json([
            'id' => $certificat->id,
            'numero' => $certificat->numero,
            'type' => $certificat->type,
            'beneficiaire' => $certificat->beneficiaire_nom,
            'dateDelivrance' => $certificat->date_delivrance?->format('d/m/Y'),
            'statut' => $certificat->statut,
        ], 201);
    }

    public function destroy(Certificat $certificat)
    {
        $certificat->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
