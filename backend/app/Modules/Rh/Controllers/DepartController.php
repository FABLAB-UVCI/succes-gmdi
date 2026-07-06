<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
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
        $d->update($request->only(['statut', 'observations', 'dernier_salaire', 'derniere_presence']));
        return response()->json($d);
    }

    public function destroy(string $id)
    {
        Depart::findOrFail($id)->delete();
        return response()->json(['message' => 'Départ supprimé.']);
    }
}
