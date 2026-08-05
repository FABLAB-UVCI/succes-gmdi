<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\Certificat;
use Illuminate\Http\Request;

class CertificatController extends Controller
{
    public function index(Request $request)
    {
        $query = Certificat::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('beneficiaire_nom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($c) => [
            'id' => $c->id,
            'numero' => $c->numero,
            'type' => $c->type,
            'beneficiaire' => $c->beneficiaire_nom . ' ' . ($c->beneficiaire_prenom ?? ''),
            'dateDelivrance' => $c->date_delivrance?->format('d/m/Y'),
            'statut' => $c->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:Naissance,Mariage,Décès,Résidence,Vie,Célibat',
            'beneficiaire_nom' => 'required|string',
            'beneficiaire_prenom' => 'nullable|string',
            'acte_reference' => 'nullable|string',
            'demandeur_nom' => 'nullable|string',
            'motif' => 'nullable|string',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        $data['date_delivrance'] = now();
        $data['statut'] = 'Délivré';
        $data['pieces_jointes'] = $this->storeUploadedFiles($request);

        $certificat = $this->createWithUniqueNumero(function () use ($data) {
            $data['numero'] = 'CI-CC-' . date('Y') . '-C-' . str_pad(Certificat::count() + 1, 6, '0', STR_PAD_LEFT);
            return Certificat::create($data);
        });

        return response()->json([
            'id' => $certificat->id,
            'numero' => $certificat->numero,
            'type' => $certificat->type,
            'beneficiaire' => $certificat->beneficiaire_nom,
            'dateDelivrance' => $certificat->date_delivrance?->format('d/m/Y'),
            'statut' => $certificat->statut,
        ], 201);
    }

    public function update(Request $request, Certificat $certificat)
    {
        $data = $request->validate([
            'type' => 'required|in:Naissance,Mariage,Décès,Résidence,Vie,Célibat',
            'beneficiaire_nom' => 'required|string',
            'beneficiaire_prenom' => 'nullable|string',
            'acte_reference' => 'nullable|string',
            'demandeur_nom' => 'nullable|string',
            'motif' => 'nullable|string',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        if ($nouvelles = $this->storeUploadedFiles($request)) {
            $data['pieces_jointes'] = array_merge($certificat->pieces_jointes ?? [], $nouvelles);
        }

        $certificat->update($data);

        return response()->json([
            'id' => $certificat->id,
            'numero' => $certificat->numero,
            'type' => $certificat->type,
            'beneficiaire' => $certificat->beneficiaire_nom,
            'dateDelivrance' => $certificat->date_delivrance?->format('d/m/Y'),
            'statut' => $certificat->statut,
        ]);
    }

    public function destroy(Certificat $certificat)
    {
        $certificat->delete();
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
            $path = $file->storeAs('etat-civil/' . date('Y-m-d'), $filename, 'public');
            $pieces[] = ['nom' => $file->getClientOriginalName(), 'url' => asset('storage/' . $path)];
        }

        return $pieces ?: null;
    }
}
