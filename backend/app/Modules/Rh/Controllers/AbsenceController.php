<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Absence;
use Illuminate\Http\Request;

class AbsenceController extends Controller
{
    public function index()
    {
        return response()->json(Absence::orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matricule' => 'required|string',
            'agent'     => 'required|string',
            'date'      => 'required|date',
            'motif'     => 'required|string',
            'justifie'  => 'boolean',
        ]);
        return response()->json(Absence::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Absence::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $absence = Absence::findOrFail($id);
        $absence->update($request->only(['motif', 'justifie']));
        return response()->json($absence);
    }

    public function destroy(string $id)
    {
        Absence::findOrFail($id)->delete();
        return response()->json(['message' => 'Absence supprimée.']);
    }
}
