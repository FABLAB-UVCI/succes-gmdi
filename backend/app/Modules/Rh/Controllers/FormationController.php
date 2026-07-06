<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index()
    {
        return response()->json(Formation::orderBy('date_debut')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'      => 'required|string',
            'organisme'  => 'required|string',
            'formateur'  => 'nullable|string',
            'date_debut' => 'required|date',
            'date_fin'   => 'required|date|after_or_equal:date_debut',
            'agents'     => 'nullable|string',
            'cout'       => 'numeric|min:0',
        ]);
        $data['statut'] = 'programme';
        return response()->json(Formation::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Formation::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $f = Formation::findOrFail($id);
        $f->update($request->only(['titre', 'organisme', 'formateur', 'date_debut', 'date_fin', 'agents', 'cout', 'statut']));
        return response()->json($f);
    }

    public function destroy(string $id)
    {
        Formation::findOrFail($id)->delete();
        return response()->json(['message' => 'Formation supprimée.']);
    }
}
