<?php

namespace App\Http\Controllers;

use App\Models\Deces;
use Illuminate\Http\Request;

class DecesController extends Controller
{
    public function index(Request $request)
    {
        $query = Deces::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($d) => [
            'id' => $d->id,
            'numero' => $d->numero,
            'nomComplet' => $d->nom . ' ' . $d->prenom,
            'nom' => $d->nom,
            'prenom' => $d->prenom,
            'dateNaissance' => $d->date_naissance?->format('d/m/Y'),
            'dateDeces' => $d->date_deces?->format('d/m/Y'),
            'heureDeces' => $d->heure_deces,
            'lieu' => $d->lieu_deces,
            'commune' => $d->commune,
            'cause' => $d->cause_deces,
            'declarant' => $d->declarant_nom,
            'lien' => $d->declarant_lien,
            'statut' => $d->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'date_naissance' => 'nullable|date',
            'date_deces' => 'required|date',
            'heure_deces' => 'nullable|string',
            'lieu_deces' => 'nullable|string',
            'commune' => 'nullable|string',
            'cause_deces' => 'nullable|string',
            'declarant_nom' => 'nullable|string',
            'declarant_lien' => 'nullable|string',
        ]);

        $data['numero'] = 'CI-CC-' . date('Y') . '-D-' . str_pad(Deces::count() + 1, 6, '0', STR_PAD_LEFT);
        $data['statut'] = 'Validé';

        $deces = Deces::create($data);

        return response()->json([
            'id' => $deces->id,
            'numero' => $deces->numero,
            'nomComplet' => $deces->nom . ' ' . $deces->prenom,
            'dateDeces' => $deces->date_deces?->format('d/m/Y'),
            'statut' => $deces->statut,
        ], 201);
    }

    public function destroy(Deces $deces)
    {
        $deces->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
