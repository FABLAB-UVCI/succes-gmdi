<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Agent;
use App\Modules\Rh\Models\Depart;
use Illuminate\Http\Request;

class DepartController extends Controller
{
    public function index()
    {
        return response()->json(Depart::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricule'         => 'required|string',
            'nom'               => 'required|string',
            'cause'             => 'required|string',
            'date'              => 'required|date',
            'derniere_presence' => 'nullable|date',
            'dernier_salaire'   => 'nullable|numeric|min:0',
            'observations'      => 'nullable|string',
        ]);
        $data['statut'] = 'attente';
        return response()->json(Depart::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Depart::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $d = Depart::findOrFail($id);
        $data = $request->only(['statut', 'observations', 'dernier_salaire', 'derniere_presence']);
        $d->update($data);

        // Marquer l'agent comme "parti" à la validation du départ : sans cela,
        // l'agent restait "actif" indéfiniment et continuait d'être compté
        // dans tous les effectifs/KPIs RH malgré un départ validé.
        if (($data['statut'] ?? null) === 'valide') {
            Agent::where('matricule', $d->matricule)->update(['statut' => 'parti']);
        }

        return response()->json($d);
    }

    public function destroy(string $id)
    {
        Depart::findOrFail($id)->delete();
        return response()->json(['message' => 'Départ supprimé.']);
    }
}
