<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\Deces;
use Illuminate\Http\Request;

class DecesController extends Controller
{
    public function index(Request $request)
    {
        $query = Deces::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($d) => [
            'id' => $d->id,
            'numero' => $d->numero,
            'nomComplet' => $d->nom . ' ' . $d->prenom,
            'nom' => $d->nom,
            'prenom' => $d->prenom,
            'dateNaissance' => $d->date_naissance?->format('d/m/Y'),
            'dateDeces' => $d->date_deces?->format('d/m/Y'),
            'heureDeces' => $d->heure_deces,
            'lieu' => $d->lieu_deces,
            'commune' => $d->commune,
            'cause' => $d->cause_deces,
            'declarant' => $d->declarant_nom,
            'lien' => $d->declarant_lien,
            'statut' => $d->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'date_naissance' => 'nullable|date',
            'date_deces' => 'required|date',
            'heure_deces' => 'nullable|string',
            'lieu_deces' => 'nullable|string',
            'commune' => 'nullable|string',
            'cause_deces' => 'nullable|string',
            'declarant_nom' => 'nullable|string',
            'declarant_lien' => 'nullable|string',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        $data['statut'] = 'Validé';
        $data['pieces_jointes'] = $this->storeUploadedFiles($request);

        $deces = $this->createWithUniqueNumero(function () use ($data) {
            $data['numero'] = 'CI-CC-' . date('Y') . '-D-' . str_pad(Deces::count() + 1, 6, '0', STR_PAD_LEFT);
            return Deces::create($data);
        });

        return response()->json([
            'id' => $deces->id,
            'numero' => $deces->numero,
            'nomComplet' => $deces->nom . ' ' . $deces->prenom,
            'dateDeces' => $deces->date_deces?->format('d/m/Y'),
            'statut' => $deces->statut,
        ], 201);
    }

    public function update(Request $request, Deces $deces)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'date_naissance' => 'nullable|date',
            'date_deces' => 'required|date',
            'heure_deces' => 'nullable|string',
            'lieu_deces' => 'nullable|string',
            'commune' => 'nullable|string',
            'cause_deces' => 'nullable|string',
            'declarant_nom' => 'nullable|string',
            'declarant_lien' => 'nullable|string',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        if ($nouvelles = $this->storeUploadedFiles($request)) {
            $data['pieces_jointes'] = array_merge($deces->pieces_jointes ?? [], $nouvelles);
        }

        $deces->update($data);

        return response()->json([
            'id' => $deces->id,
            'numero' => $deces->numero,
            'nomComplet' => $deces->nom . ' ' . $deces->prenom,
            'dateDeces' => $deces->date_deces?->format('d/m/Y'),
            'statut' => $deces->statut,
        ]);
    }

    public function destroy(Deces $deces)
    {
        $deces->delete();
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
