<?php

namespace App\Modules\Rh\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Rh\Models\Recrutement;
use Illuminate\Http\Request;

class RecrutementController extends Controller
{
    public function index()
    {
        return response()->json(Recrutement::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'poste'     => 'required|string',
            'direction' => 'required|string',
            'nb_postes' => 'required|integer|min:1',
            'type'      => 'required|in:concours,direct,stage',
            'cloture'   => 'required|date',
        ]);
        $data['candidatures'] = 0;
        $data['statut']       = 'en_cours';
        return response()->json(Recrutement::create($data), 201);
    }

    public function show(string $id)
    {
        return response()->json(Recrutement::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $r = Recrutement::findOrFail($id);
        $r->update($request->only(['statut', 'candidatures', 'poste', 'direction', 'nb_postes', 'type', 'cloture']));
        return response()->json($r);
    }

    public function destroy(string $id)
    {
        Recrutement::findOrFail($id)->delete();
        return response()->json(['message' => 'Recrutement supprimé.']);
    }
}
