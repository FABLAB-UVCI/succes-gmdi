<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\Naissance;
use Illuminate\Http\Request;

class NaissanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Naissance::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        if ($type = $request->get('type')) {
            $query->where('type', $type);
        }

        return response()->json($query->latest()->get()->map(fn($n) => [
            'id' => $n->id,
            'numero' => $n->numero,
            'nomComplet' => $n->nom . ' ' . $n->prenom,
            'nom' => $n->nom,
            'prenom' => $n->prenom,
            'dateNaissance' => $n->date_naissance?->format('d/m/Y'),
            'heureNaissance' => $n->heure_naissance,
            'lieu' => $n->lieu_naissance,
            'commune' => $n->commune,
            'sexe' => $n->sexe,
            'pereNom' => $n->pere_nom,
            'pereProf' => $n->pere_profession,
            'pereNat' => $n->pere_nationalite,
            'mereNom' => $n->mere_nom,
            'mereProf' => $n->mere_profession,
            'mereNat' => $n->mere_nationalite,
            'tribunal' => $n->tribunal,
            'dateJugement' => $n->date_jugement?->format('d/m/Y'),
            'type' => $n->type,
            'statut' => $n->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'nullable|string',
            'date_naissance' => 'required|date',
            'heure_naissance' => 'nullable|string',
            'sexe' => 'nullable|in:Masculin,Féminin',
            'lieu_naissance' => 'nullable|string',
            'commune' => 'nullable|string',
            'pere_nom' => 'nullable|string',
            'pere_profession' => 'nullable|string',
            'pere_nationalite' => 'nullable|string',
            'mere_nom' => 'nullable|string',
            'mere_profession' => 'nullable|string',
            'mere_nationalite' => 'nullable|string',
            'type' => 'nullable|in:Déclaration,Jugement,Adoption',
            'tribunal' => 'nullable|string',
            'date_jugement' => 'nullable|date',
        ]);

        $data['prenom'] = $data['prenom'] ?? '';
        $data['type'] = $data['type'] ?? 'Déclaration';
        $lettre = ['Déclaration' => 'N', 'Jugement' => 'J', 'Adoption' => 'A'][$data['type']] ?? 'N';
        $data['numero'] = 'CI-CC-' . date('Y') . "-$lettre-" . str_pad(Naissance::where('type', $data['type'])->count() + 1, 6, '0', STR_PAD_LEFT);
        $data['statut'] = 'Validé';

        $naissance = Naissance::create($data);

        return response()->json([
            'id' => $naissance->id,
            'numero' => $naissance->numero,
            'nomComplet' => trim($naissance->nom . ' ' . $naissance->prenom),
            'nom' => $naissance->nom,
            'prenom' => $naissance->prenom,
            'dateNaissance' => $naissance->date_naissance?->format('d/m/Y'),
            'heureNaissance' => $naissance->heure_naissance,
            'lieu' => $naissance->lieu_naissance,
            'commune' => $naissance->commune,
            'sexe' => $naissance->sexe,
            'pereNom' => $naissance->pere_nom,
            'pereProf' => $naissance->pere_profession,
            'pereNat' => $naissance->pere_nationalite,
            'mereNom' => $naissance->mere_nom,
            'mereProf' => $naissance->mere_profession,
            'mereNat' => $naissance->mere_nationalite,
            'type' => $naissance->type,
            'statut' => $naissance->statut,
        ], 201);
    }

    public function show(Naissance $naissance)
    {
        return response()->json($naissance);
    }

    public function destroy(Naissance $naissance)
    {
        $naissance->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
