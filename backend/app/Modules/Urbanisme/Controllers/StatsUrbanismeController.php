<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\Parcelle;
use App\Modules\Urbanisme\Models\Lot;
use App\Modules\Urbanisme\Models\TitreFoncier;
use App\Modules\Urbanisme\Models\Permis;
use App\Modules\Urbanisme\Models\Lotissement;
use App\Modules\Urbanisme\Models\EquipementPublic;
use App\Modules\Urbanisme\Models\SuiviChantier;
use Illuminate\Http\Request;

class StatsUrbanismeController extends Controller
{
    /**
     * GET /api/urb/statistiques
     * Format attendu par Angular : StatsUrbanismeApi
     */
    public function dashboard(Request $request)
    {
        $totalParcelles  = Parcelle::count();
        $parcellesLibres = Parcelle::where('statut', 'libre')->count();
        $permisEnCours   = Permis::whereIn('statut', ['depose', 'instruction'])->count();
        $permisAccordes  = Permis::where('statut', 'accorde')->count();
        $chantiersEnCours= SuiviChantier::whereIn('statut', ['actif', 'retard'])->count();
        $equipements     = EquipementPublic::count();

        // Taux d'urbanisation approximatif (parcelles occupées / total)
        $tauxUrba = $totalParcelles > 0
            ? round((Parcelle::whereIn('statut', ['occupe','reserve'])->count() / $totalParcelles) * 100, 1)
            : 0;

        // Répartition parcelles par statut
        $repParcelles = Parcelle::selectRaw('statut, COUNT(*) as nb, SUM(superficie) as superficie')
            ->groupBy('statut')->get()
            ->map(fn($r) => ['statut'=>$r->statut,'nb'=>(int)$r->nb,'superficie'=>(float)$r->superficie]);

        // Permis par statut
        $repPermis = Permis::selectRaw('statut, COUNT(*) as nb')
            ->groupBy('statut')->get()
            ->map(fn($r) => ['statut'=>$r->statut,'nb'=>(int)$r->nb]);

        // Équipements par type
        $repEquip = EquipementPublic::selectRaw('type, COUNT(*) as nb')
            ->groupBy('type')->orderByDesc('nb')->get()
            ->map(fn($r) => ['type'=>$r->type,'nb'=>(int)$r->nb]);

        // Avancement des projets (lotissements + chantiers actifs)
        $projetsAvancement = SuiviChantier::whereIn('statut', ['actif','retard'])
            ->orderByDesc('date_ouverture')->limit(10)->get()
            ->map(fn($c) => ['projet'=>$c->projet,'avancement'=>$c->taux_avancement,'statut'=>$c->statut]);

        return response()->json([
            'kpi' => [
                'total_parcelles'    => $totalParcelles,
                'parcelles_libres'   => $parcellesLibres,
                'permis_en_cours'    => $permisEnCours,
                'permis_accordes'    => $permisAccordes,
                'chantiers_en_cours' => $chantiersEnCours,
                'equipements_publics'=> $equipements,
                'taux_urbanisation'  => $tauxUrba,
            ],
            'repartition_parcelles' => $repParcelles,
            'permis_par_statut'     => $repPermis,
            'equipements_par_type'  => $repEquip,
            'projets_avancement'    => $projetsAvancement,
        ]);
    }

    /**
     * GET /api/urb/export?type=parcelles|permis|lots|titres|all
     */
    public function export(Request $request)
    {
        $type = $request->get('type', 'parcelles');
        $data = match ($type) {
            'permis'      => Permis::all(),
            'lots'        => Lot::all(),
            'titres'      => TitreFoncier::all(),
            'all'         => [
                'parcelles'   => Parcelle::all(),
                'permis'      => Permis::all(),
                'lots'        => Lot::all(),
                'titres'      => TitreFoncier::all(),
                'exported_at' => now()->toISOString(),
            ],
            default       => Parcelle::all(),
        };

        return response()->json([
            'success' => true,
            'type'    => $type,
            'count'   => is_array($data) ? count($data) : $data->count(),
            'data'    => $data,
        ]);
    }
}
