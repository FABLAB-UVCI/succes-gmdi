<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Agent;
use App\Modules\Rh\Models\Conge;
use Illuminate\Http\Request;

class CongeController extends Controller
{
    public function index()
    {
        return response()->json(Conge::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricule'   => 'required|string',
            'agent'       => 'required|string',
            'type'        => 'required|in:annuel,maladie,maternite,paternite,deces,autre',
            'date_debut'  => 'required|date',
            'duree'       => 'required|integer|min:1',
            'motif'       => 'nullable|string',
            'piece_jointe'=> 'nullable|string',
        ]);

        // Refuser la demande si elle dépasse le solde de congés restants de l'agent
        $agent = Agent::where('matricule', $data['matricule'])->first();
        if ($agent && $data['duree'] > $agent->conges_restants) {
            return response()->json([
                'message' => "Solde de congés insuffisant : {$agent->conges_restants} jour(s) restant(s), {$data['duree']} demandé(s).",
            ], 422);
        }

        $data['statut'] = 'soumis';
        return response()->json(Conge::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Conge::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $conge = Conge::findOrFail($id);
        $data = $request->validate([
            'statut' => 'sometimes|in:soumis,approuve,refuse,en_cours',
            'motif'  => 'nullable|string',
        ]);

        // Décompter le solde de congés de l'agent uniquement au moment où la
        // demande passe à "approuve" (jamais fait auparavant : conges_restants
        // restait figé à sa valeur initiale quelle que soit l'issue des demandes).
        if (($data['statut'] ?? null) === 'approuve' && $conge->statut !== 'approuve') {
            $agent = Agent::where('matricule', $conge->matricule)->first();
            if ($agent) {
                if ($conge->duree > $agent->conges_restants) {
                    return response()->json([
                        'message' => "Solde de congés insuffisant : {$agent->conges_restants} jour(s) restant(s), {$conge->duree} demandé(s).",
                    ], 422);
                }
                $agent->update(['conges_restants' => $agent->conges_restants - $conge->duree]);
            }
        }

        $conge->update($data);
        return response()->json($conge);
    }

    public function destroy(string $id)
    {
        Conge::findOrFail($id)->delete();
        return response()->json(['message' => 'Congé supprimé.']);
    }
}
