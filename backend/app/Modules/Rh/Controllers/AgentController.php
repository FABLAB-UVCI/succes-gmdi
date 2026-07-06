<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Agent;
use Illuminate\Http\Request;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $query = Agent::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom_complet', 'like', "%$search%")
                  ->orWhere('matricule', 'like', "%$search%");
            });
        }
        if ($direction = $request->get('direction')) {
            $query->where('direction', $direction);
        }
        if ($contrat = $request->get('type_contrat')) {
            $query->where('type_contrat', $contrat);
        }
        if ($statut = $request->get('statut')) {
            $query->where('statut', $statut);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricule'          => 'required|string|unique:agents',
            'nom_complet'        => 'required|string',
            'nom'                => 'nullable|string',
            'prenom'             => 'nullable|string',
            'poste'              => 'required|string',
            'direction'          => 'required|string',
            'type_contrat'       => 'required|in:fonctionnaire,contractuel,stage',
            'categorie'          => 'required|in:A,B,C,Stagiaire',
            'specialite'         => 'nullable|string',
            'grade'              => 'required|string',
            'date_embauche'      => 'required|date',
            'date_naissance'     => 'required|date',
            'genre'              => 'required|in:M,F',
            'telephone'          => 'required|string',
            'email'              => 'required|email|unique:agents',
            'statut'             => 'in:actif,conge,suspendu',
            'salaire_brut'       => 'numeric|min:0',
            'conges_restants'    => 'integer|min:0',
            'situation_familiale'=> 'nullable|string',
            'diplome'            => 'nullable|string',
        ]);

        $agent = Agent::create($data);
        return response()->json($agent, 201);
    }

    public function show(string $id)
    {
        return response()->json(Agent::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $agent = Agent::findOrFail($id);
        $data = $request->validate([
            'matricule'          => 'sometimes|string|unique:agents,matricule,' . $id,
            'nom_complet'        => 'sometimes|string',
            'nom'                => 'nullable|string',
            'prenom'             => 'nullable|string',
            'poste'              => 'sometimes|string',
            'direction'          => 'sometimes|string',
            'type_contrat'       => 'sometimes|in:fonctionnaire,contractuel,stage',
            'categorie'          => 'sometimes|in:A,B,C,Stagiaire',
            'specialite'         => 'nullable|string',
            'grade'              => 'sometimes|string',
            'date_embauche'      => 'sometimes|date',
            'date_naissance'     => 'sometimes|date',
            'genre'              => 'sometimes|in:M,F',
            'telephone'          => 'sometimes|string',
            'email'              => 'sometimes|email|unique:agents,email,' . $id,
            'statut'             => 'sometimes|in:actif,conge,suspendu',
            'salaire_brut'       => 'sometimes|numeric|min:0',
            'conges_restants'    => 'sometimes|integer|min:0',
            'situation_familiale'=> 'nullable|string',
            'diplome'            => 'nullable|string',
        ]);

        $agent->update($data);
        return response()->json($agent);
    }

    public function destroy(string $id)
    {
        Agent::findOrFail($id)->delete();
        return response()->json(['message' => 'Agent supprimé.']);
    }
}
