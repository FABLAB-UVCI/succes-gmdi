<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
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
        $conge->update($data);
        return response()->json($conge);
    }

    public function destroy(string $id)
    {
        Conge::findOrFail($id)->delete();
        return response()->json(['message' => 'Congé supprimé.']);
    }
}
