<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\Mariage;
use Illuminate\Http\Request;

class MariageController extends Controller
{
    public function index(Request $request)
    {
        $query = Mariage::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('epoux_nom', 'like', "%$search%")
                  ->orWhere('epouse_nom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($m) => [
            'id' => $m->id,
            'numero' => $m->numero,
            'epoux' => $m->epoux_nom . ' ' . $m->epoux_prenom,
            'epouse' => $m->epouse_nom . ' ' . $m->epouse_prenom,
            'dateMariage' => $m->date_mariage?->format('d/m/Y'),
            'lieu' => $m->lieu_mariage,
            'commune' => $m->commune,
            'regime' => $m->regime_matrimonial,
            'epouxProf' => $m->epoux_profession,
            'epouxNat' => $m->epoux_nationalite,
            'epouseProf' => $m->epouse_profession,
            'epouseNat' => $m->epouse_nationalite,
            'temoin1' => $m->temoin1_nom,
            'temoin1Prof' => $m->temoin1_profession,
            'temoin2' => $m->temoin2_nom,
            'temoin2Prof' => $m->temoin2_profession,
            'statut' => $m->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'epoux_nom' => 'required|string',
            'epoux_prenom' => 'nullable|string',
            'epoux_date_naissance' => 'nullable|date',
            'epoux_nationalite' => 'nullable|string',
            'epoux_profession' => 'nullable|string',
            'epouse_nom' => 'required|string',
            'epouse_prenom' => 'nullable|string',
            'epouse_date_naissance' => 'nullable|date',
            'epouse_nationalite' => 'nullable|string',
            'epouse_profession' => 'nullable|string',
            'date_mariage' => 'required|date',
            'lieu_mariage' => 'nullable|string',
            'commune' => 'nullable|string',
            'regime_matrimonial' => 'nullable|string',
            'temoin1_nom' => 'nullable|string',
            'temoin1_profession' => 'nullable|string',
            'temoin2_nom' => 'nullable|string',
            'temoin2_profession' => 'nullable|string',
        ]);

        $data['epoux_prenom']  = $data['epoux_prenom']  ?? '';
        $data['epouse_prenom'] = $data['epouse_prenom'] ?? '';
        $data['numero'] = 'CI-CC-' . date('Y') . '-M-' . str_pad(Mariage::count() + 1, 6, '0', STR_PAD_LEFT);
        $data['statut'] = 'Validé';

        $mariage = Mariage::create($data);

        return response()->json([
            'id' => $mariage->id,
            'numero' => $mariage->numero,
            'epoux' => $mariage->epoux_nom . ' ' . $mariage->epoux_prenom,
            'epouse' => $mariage->epouse_nom . ' ' . $mariage->epouse_prenom,
            'dateMariage' => $mariage->date_mariage?->format('d/m/Y'),
            'lieu' => $mariage->lieu_mariage,
            'commune' => $mariage->commune,
            'regime' => $mariage->regime_matrimonial,
            'epouxProf' => $mariage->epoux_profession,
            'epouxNat' => $mariage->epoux_nationalite,
            'epouseProf' => $mariage->epouse_profession,
            'epouseNat' => $mariage->epouse_nationalite,
            'temoin1' => $mariage->temoin1_nom,
            'temoin1Prof' => $mariage->temoin1_profession,
            'temoin2' => $mariage->temoin2_nom,
            'temoin2Prof' => $mariage->temoin2_profession,
            'statut' => $mariage->statut,
        ], 201);
    }

    public function destroy(Mariage $mariage)
    {
        $mariage->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
