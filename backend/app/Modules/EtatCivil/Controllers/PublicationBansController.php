<?php

namespace App\Modules\EtatCivil\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\EtatCivil\Models\PublicationBans;
use Illuminate\Http\Request;

class PublicationBansController extends Controller
{
    public function index(Request $request)
    {
        $query = PublicationBans::query();

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('epoux_nom', 'like', "%$search%")
                  ->orWhere('epouse_nom', 'like', "%$search%")
                  ->orWhere('numero', 'like', "%$search%");
            });
        }

        return response()->json($query->latest()->get()->map(fn($b) => [
            'id' => $b->id,
            'numero' => $b->numero,
            'epoux' => $b->epoux_nom,
            'epouse' => $b->epouse_nom,
            'datePublication' => $b->date_publication?->format('d/m/Y'),
            'dateMariagePrevue' => $b->date_mariage_prevue?->format('d/m/Y'),
            'statut' => $b->statut,
        ]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'epoux_nom' => 'required|string',
            'epouse_nom' => 'required|string',
            'date_publication' => 'required|date',
            'date_mariage_prevue' => 'nullable|date',
        ]);

        $data['statut'] = 'Publié';

        $bans = $this->createWithUniqueNumero(function () use ($data) {
            $data['numero'] = 'CI-CC-' . date('Y') . '-B-' . str_pad(PublicationBans::count() + 1, 6, '0', STR_PAD_LEFT);
            return PublicationBans::create($data);
        });

        return response()->json([
            'id' => $bans->id,
            'numero' => $bans->numero,
            'epoux' => $bans->epoux_nom,
            'epouse' => $bans->epouse_nom,
            'datePublication' => $bans->date_publication?->format('d/m/Y'),
            'dateMariagePrevue' => $bans->date_mariage_prevue?->format('d/m/Y'),
            'statut' => $bans->statut,
        ], 201);
    }

    public function destroy(PublicationBans $publicationsBan)
    {
        $publicationsBan->delete();
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
}
