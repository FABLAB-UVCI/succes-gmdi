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
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        $data['epoux_prenom']  = $data['epoux_prenom']  ?? '';
        $data['epouse_prenom'] = $data['epouse_prenom'] ?? '';
        $data['statut'] = 'Validé';
        $data['pieces_jointes'] = $this->storeUploadedFiles($request);

        $mariage = $this->createWithUniqueNumero(function () use ($data) {
            $data['numero'] = 'CI-CC-' . date('Y') . '-M-' . str_pad(Mariage::count() + 1, 6, '0', STR_PAD_LEFT);
            return Mariage::create($data);
        });

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

    public function update(Request $request, Mariage $mariage)
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
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        $data['epoux_prenom']  = $data['epoux_prenom']  ?? '';
        $data['epouse_prenom'] = $data['epouse_prenom'] ?? '';
        if ($nouvelles = $this->storeUploadedFiles($request)) {
            $data['pieces_jointes'] = array_merge($mariage->pieces_jointes ?? [], $nouvelles);
        }

        $mariage->update($data);

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
        ]);
    }

    public function destroy(Mariage $mariage)
    {
        $mariage->delete();
        return response()->json(['message' => 'Supprimé']);
    }

    private function createWithUniqueNumero(\Closure $attempt, int $maxAttempts = 5)
    {
        for ($i = 0; $i < $maxAttempts; $i++) {
            try {
                return $attempt();
            } catch (\Illuminate\Database\QueryException $e) {
                if ($i >= $maxAttempts - 1 || !str_contains(strtolower($e->getMessage()), 'unique')) {
                    throw $e;
                }
            }
        }
    }

    private function storeUploadedFiles(Request $request): ?array
    {
        if (! $request->hasFile('files')) {
            return null;
        }

        $pieces = [];
        foreach ($request->file('files') as $file) {
            $filename = \Illuminate\Support\Str::random(40) . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('etat-civil/' . date('Y-m-d'), $filename, 'local');
            $pieces[] = ['nom' => $file->getClientOriginalName(), 'path' => $path];
        }

        return $pieces ?: null;
    }
}
