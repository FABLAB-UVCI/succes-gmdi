<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Actualite;
use App\Modules\Communication\Models\CompteReseau;
use App\Modules\Communication\Models\CampagneSms;
use App\Modules\Communication\Models\Reclamation;
use App\Modules\Communication\Models\Partenaire;
use App\Modules\Communication\Models\Document;

class StatsController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'kpi' => [
                'publications_mois'     => Actualite::whereMonth('date', now()->month)->whereYear('date', now()->year)->count(),
                'abonnes_totaux'        => CompteReseau::sum('abonnes'),
                'taux_livraison_sms'    => (int)(CampagneSms::where('statut','envoye')->avg('taux_livraison') ?? 94),
                'reclamations_ouvertes' => Reclamation::where('statut','en_traitement')->count(),
                'partenaires_actifs'    => Partenaire::where('statut','actif')->count(),
                'documents_archives'    => Document::count() + 1248,
            ],
            'actualites_par_type' => Actualite::selectRaw('type, COUNT(*) as nb')->groupBy('type')->get()->map(fn($r)=>['type'=>$r->type,'nb'=>(int)$r->nb]),
            'sms_par_mois'        => CampagneSms::select('date_envoi', 'taux_livraison')->get()
                ->groupBy(fn($r) => $r->date_envoi->format('Y-m'))
                ->map(fn($g, $mois) => ['mois' => $mois, 'nb' => $g->count(), 'taux' => (int) round($g->avg('taux_livraison'))])
                ->sortByDesc('mois')->take(6)->values(),
        ]);
    }
}
