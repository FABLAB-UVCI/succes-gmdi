<?php

namespace App\Modules\Patrimoine\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Patrimoine\Models\Vehicule;
use App\Modules\Patrimoine\Models\Terrain;
use App\Modules\Patrimoine\Models\Bien;
use Illuminate\Http\Request;
use Carbon\Carbon;

// ═══════════════════════════════════════════════════════════════════════════
//  VehiculeController
// ═══════════════════════════════════════════════════════════════════════════

class VehiculeController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicule::query()->orderByDesc('created_at');
        if ($s = $request->get('statut')) $query->where('statut', $s);
        $data = $query->paginate((int) $request->get('per_page', 20));
        return response()->json(['data' => $data->map(fn($v) => $this->fmtV($v)), 'meta' => $this->meta($data), 'links' => $this->links($data)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'modele'              => 'required|string|max:200',
            'immatriculation'     => 'required|string|max:30|unique:vehicules,immatriculation',
            'kilometrage'         => 'nullable|integer|min:0',
            'affectation'         => 'required|string|max:200',
            'valeur'              => 'nullable|numeric|min:0',
            'fin_assurance'       => 'nullable|date',
            'fin_visite_technique'=> 'nullable|date',
        ]);

        $veh = Vehicule::create(array_merge($validated, ['statut' => 'occupe']));

        // Crée aussi un Bien lié dans l'inventaire général
        $ref = 'PAT-VEH-' . str_pad(Bien::where('categorie', 'vehicule')->count() + 1, 3, '0', STR_PAD_LEFT);
        Bien::create([
            'reference' => $ref, 'designation' => $veh->modele,
            'categorie' => 'vehicule', 'localisation' => 'Garage communal',
            'valeur_acquisition' => $veh->valeur ?? 0, 'valeur_actuelle' => $veh->valeur ?? 0,
            'date_acquisition' => now()->format('Y-m-d'), 'affectation' => $veh->affectation,
            'statut' => 'occupe', 'taux_amortissement' => 20,
            'qr_code' => 'QR-' . $ref,
        ]);

        return response()->json(['success' => true, 'message' => "Véhicule enregistré — {$veh->immatriculation}", 'data' => $this->fmtV($veh)], 201);
    }

    public function show($id)
    {
        return response()->json(['success' => true, 'message' => 'OK', 'data' => $this->fmtV(Vehicule::findOrFail($id))]);
    }

    public function update(Request $request, $id)
    {
        $veh = Vehicule::findOrFail($id);
        $veh->update($request->validate(['kilometrage' => 'sometimes|integer|min:0', 'affectation' => 'sometimes|string|max:200', 'statut' => 'sometimes|in:occupe,en_maintenance,en_panne']));
        return response()->json(['success' => true, 'message' => 'Véhicule mis à jour.', 'data' => $this->fmtV($veh->fresh())]);
    }

    public function updateKm(Request $request, $id)
    {
        $veh = Vehicule::findOrFail($id);
        $request->validate(['kilometrage' => 'required|integer|min:0']);
        $veh->update(['kilometrage' => $request->kilometrage]);
        return response()->json(['success' => true, 'message' => 'Kilométrage mis à jour.', 'data' => $this->fmtV($veh->fresh())]);
    }

    public function destroy($id) { Vehicule::findOrFail($id)->delete(); return response()->json(['success' => true, 'message' => 'Véhicule supprimé.', 'data' => null]); }

    private function fmtV(Vehicule $v): array
    {
        return ['id' => $v->id, 'modele' => $v->modele, 'immatriculation' => $v->immatriculation, 'kilometrage' => $v->kilometrage, 'affectation' => $v->affectation, 'valeur' => $v->valeur, 'fin_assurance' => $v->fin_assurance?->format('Y-m'), 'fin_visite_technique' => $v->fin_visite_technique?->format('Y-m'), 'statut' => $v->statut, 'created_at' => $v->created_at?->toISOString()];
    }
    private function meta($p): array { return ['current_page' => $p->currentPage(), 'last_page' => $p->lastPage(), 'per_page' => $p->perPage(), 'total' => $p->total(), 'from' => $p->firstItem(), 'to' => $p->lastItem()]; }
    private function links($p): array { return ['first' => $p->url(1), 'last' => $p->url($p->lastPage()), 'prev' => $p->previousPageUrl(), 'next' => $p->nextPageUrl()]; }
}

