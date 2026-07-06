<?php

namespace App\Modules\Urbanisme\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Urbanisme\Models\Lotissement;
use App\Modules\Urbanisme\Models\AmenagementUrbain;
use App\Modules\Urbanisme\Models\SuiviChantier;
use Illuminate\Http\Request;

class ProjetsController extends Controller
{
    private function meta($p): array { return ['current_page'=>$p->currentPage(),'last_page'=>$p->lastPage(),'per_page'=>$p->perPage(),'total'=>$p->total(),'from'=>$p->firstItem(),'to'=>$p->lastItem()]; }
    private function links($p): array { return ['first'=>$p->url(1),'last'=>$p->url($p->lastPage()),'prev'=>$p->previousPageUrl(),'next'=>$p->nextPageUrl()]; }

    // ═══════════════════════════════════════════════════════════════════════
    //  LOTISSEMENTS
    // ═══════════════════════════════════════════════════════════════════════

    public function indexLotissements(Request $request)
    {
        $q = Lotissement::query()->orderByDesc('created_at');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($l)=>$this->fmtLot($l)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeLotissement(Request $request)
    {
        $v = $request->validate([
            'nom'             => 'nullable|string|max:200',
            'denomination'    => 'nullable|string|max:200',
            'promoteur'       => 'required|string|max:200',
            'localisation'    => 'required|string|max:250',
            'nb_lots'         => 'nullable|integer|min:1',
            'nombre_lots'     => 'nullable|integer|min:1',
            'superficie_totale'=> 'nullable|numeric|min:0',
            'superficie'      => 'nullable|numeric|min:0',
            'date_agrement'   => 'nullable|date',
            'date_approb'     => 'nullable|date',
            'date_debut'      => 'nullable|date',
            'statut'          => 'nullable|in:etude,approuve,en_cours,termine,suspendu',
        ]);

        // Normaliser les champs (frontend ↔ backend)
        $denomination = $v['denomination'] ?? $v['nom'] ?? 'Lotissement sans nom';
        $nombre_lots  = $v['nombre_lots']  ?? $v['nb_lots'] ?? 1;
        $superficie   = $v['superficie']   ?? $v['superficie_totale'] ?? 0;
        $date_approb  = $v['date_approb']  ?? $v['date_agrement'] ?? null;

        $seq = str_pad(Lotissement::count() + 1, 3, '0', STR_PAD_LEFT);
        $l = Lotissement::create([
            'reference'       => 'LOT-' . date('Y') . "-{$seq}",
            'denomination'    => $denomination,
            'promoteur'       => $v['promoteur'],
            'localisation'    => $v['localisation'],
            'superficie'      => $superficie,
            'nombre_lots'     => $nombre_lots,
            'lots_disponibles'=> $nombre_lots,
            'date_approb'     => $date_approb,
            'statut'          => $v['statut'] ?? 'etude',
        ]);
        return response()->json(['success'=>true,'message'=>"Lotissement enregistré — {$l->reference}",'data'=>$this->fmtLot($l)], 201);
    }

    public function updateLotissement(Request $request, $id)
    {
        $l = Lotissement::findOrFail($id);
        $l->update($request->validate(['denomination'=>'sometimes|string|max:200','statut'=>'sometimes|in:etude,approuve,en_cours,termine,suspendu','lots_disponibles'=>'sometimes|integer|min:0']));
        return response()->json(['success'=>true,'message'=>'Lotissement mis à jour.','data'=>$this->fmtLot($l->fresh())]);
    }

    public function updateStatutLotissement(Request $request, $id)
    {
        $l = Lotissement::findOrFail($id);
        $request->validate(['statut'=>'required|in:etude,approuve,en_cours,termine,suspendu']);
        $l->update(['statut'=>$request->statut]);
        return response()->json(['success'=>true,'message'=>"Statut : {$request->statut}",'data'=>$this->fmtLot($l->fresh())]);
    }

    public function updateAvancementLotissement(Request $request, $id)
    {
        $l = Lotissement::findOrFail($id);
        $request->validate(['avancement'=>'required|integer|between:0,100']);
        // Stocker l'avancement dans lots_disponibles proportionnellement ou dans un champ dédié si disponible
        $updates = [];
        if ($request->avancement >= 100) $updates['statut'] = 'termine';
        $l->update($updates);
        return response()->json(['success'=>true,'message'=>"Avancement : {$request->avancement}%",'data'=>$this->fmtLot($l->fresh())]);
    }

    private function fmtLot(Lotissement $l): array
    {
        return [
            'id'              => $l->id,
            'reference'       => $l->reference,
            'denomination'    => $l->denomination,
            'nom'             => $l->denomination,
            'promoteur'       => $l->promoteur,
            'localisation'    => $l->localisation,
            'superficie'      => $l->superficie,
            'superficie_totale'=> $l->superficie,
            'nombre_lots'     => $l->nombre_lots,
            'nb_lots'         => $l->nombre_lots,
            'lots_disponibles'=> $l->lots_disponibles,
            'date_approb'     => $l->date_approb?->format('Y-m-d'),
            'date_agrement'   => $l->date_approb?->format('Y-m-d'),
            'statut'          => $l->statut,
            'avancement'      => 0,
            'created_at'      => $l->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  AMÉNAGEMENTS URBAINS
    // ═══════════════════════════════════════════════════════════════════════

    public function indexAmenagements(Request $request)
    {
        $q = AmenagementUrbain::query()->orderByDesc('created_at');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($a)=>$this->fmtAm($a)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeAmenagement(Request $request)
    {
        $v = $request->validate([
            'designation'     => 'nullable|string|max:200',
            'intitule'        => 'nullable|string|max:200',
            'type'            => 'required|string|max:100',
            'localisation'    => 'required|string|max:250',
            'superficie'      => 'nullable|numeric',
            'budget'          => 'required|numeric|min:0',
            'bailleur'        => 'nullable|string|max:150',
            'financeur'       => 'nullable|string|max:150',
            'date_debut'      => 'nullable|date',
            'date_fin'        => 'nullable|date',
            'taux_avancement' => 'nullable|integer|between:0,100',
        ]);

        // Normaliser
        $intitule = $v['intitule'] ?? $v['designation'] ?? 'Aménagement';
        $financeur = $v['financeur'] ?? $v['bailleur'] ?? null;

        $a = AmenagementUrbain::create([
            'intitule'        => $intitule,
            'type'            => $v['type'],
            'localisation'    => $v['localisation'],
            'superficie'      => $v['superficie'] ?? null,
            'budget'          => $v['budget'],
            'financeur'       => $financeur,
            'date_debut'      => $v['date_debut'] ?? null,
            'date_fin'        => $v['date_fin'] ?? null,
            'taux_avancement' => $v['taux_avancement'] ?? 0,
            'statut'          => 'etude',
        ]);
        return response()->json(['success'=>true,'message'=>"Aménagement enregistré — {$a->intitule}",'data'=>$this->fmtAm($a)], 201);
    }

    public function updateAmenagement(Request $request, $id)
    {
        $a = AmenagementUrbain::findOrFail($id);
        $a->update($request->validate(['statut'=>'sometimes|in:etude,approuve,en_cours,termine,suspendu','taux_avancement'=>'sometimes|integer|between:0,100','budget'=>'sometimes|numeric']));
        return response()->json(['success'=>true,'message'=>'Aménagement mis à jour.','data'=>$this->fmtAm($a->fresh())]);
    }

    public function updateAvancement(Request $request, $id)
    {
        // Chantier ou aménagement — détecter par contexte
        if ($c = SuiviChantier::find($id)) {
            $request->validate(['taux_avancement'=>'nullable|integer|between:0,100','avancement'=>'nullable|integer|between:0,100','observations'=>'nullable|string|max:500']);
            $taux = $request->taux_avancement ?? $request->avancement ?? 0;
            $updates = ['taux_avancement'=>$taux,'derniere_visite'=>now()->format('Y-m-d')];
            if (!empty($request->observations)) $updates['observations'] = $request->observations;
            if ($taux >= 100) $updates['statut'] = 'termine';
            $c->update($updates);
            return response()->json(['success'=>true,'message'=>"Avancement : {$taux}%",'data'=>$this->fmtCh($c->fresh())]);
        }

        $a = AmenagementUrbain::findOrFail($id);
        $request->validate(['avancement'=>'required|integer|between:0,100']);
        $updates = ['taux_avancement'=>$request->avancement];
        if ($request->avancement >= 100) $updates['statut'] = 'termine';
        $a->update($updates);
        return response()->json(['success'=>true,'message'=>"Avancement : {$request->avancement}%",'data'=>$this->fmtAm($a->fresh())]);
    }

    private function fmtAm(AmenagementUrbain $a): array
    {
        return [
            'id'          => $a->id,
            'intitule'    => $a->intitule,
            'designation' => $a->intitule,
            'type'        => $a->type,
            'localisation'=> $a->localisation,
            'superficie'  => $a->superficie,
            'budget'      => $a->budget,
            'financeur'   => $a->financeur,
            'bailleur'    => $a->financeur,
            'date_debut'  => $a->date_debut?->format('Y-m-d'),
            'date_fin'    => $a->date_fin?->format('Y-m-d'),
            'taux_avancement'=> $a->taux_avancement,
            'avancement'  => $a->taux_avancement,
            'statut'      => $a->statut,
            'created_at'  => $a->created_at?->toISOString(),
        ];
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SUIVI CHANTIERS
    // ═══════════════════════════════════════════════════════════════════════

    public function indexChantiers(Request $request)
    {
        $q = SuiviChantier::query()->orderByDesc('date_ouverture');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        SuiviChantier::where('date_prevue_fin', '<', now()->format('Y-m-d'))
            ->where('statut', 'actif')
            ->where('taux_avancement', '<', 100)
            ->update(['statut' => 'retard']);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($c)=>$this->fmtCh($c)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeChantier(Request $request)
    {
        $v = $request->validate([
            'projet'          => 'required|string|max:200',
            'entrepreneur'    => 'required|string|max:200',
            'date_visite'     => 'nullable|date',
            'date_ouverture'  => 'nullable|date',
            'date_prevue_fin' => 'nullable|date',
            'avancement'      => 'nullable|integer|between:0,100',
            'taux_avancement' => 'nullable|integer|between:0,100',
            'observations'    => 'nullable|string|max:500',
            'recommandations' => 'nullable|string|max:500',
            'controleur'      => 'nullable|string|max:200',
        ]);

        // Normaliser
        $date_ouverture  = $v['date_ouverture'] ?? $v['date_visite'] ?? now()->format('Y-m-d');
        $date_prevue_fin = $v['date_prevue_fin'] ?? date('Y-m-d', strtotime($date_ouverture . ' +6 months'));
        $taux            = $v['taux_avancement'] ?? $v['avancement'] ?? 0;

        $c = SuiviChantier::create([
            'projet'           => $v['projet'],
            'entrepreneur'     => $v['entrepreneur'],
            'date_ouverture'   => $date_ouverture,
            'date_prevue_fin'  => $date_prevue_fin,
            'taux_avancement'  => $taux,
            'observations'     => $v['observations'] ?? null,
            'recommandations'  => $v['recommandations'] ?? null,
            'controleur'       => $v['controleur'] ?? null,
            'date_visite'      => $v['date_visite'] ?? null,
            'statut'           => 'actif',
        ]);
        return response()->json(['success'=>true,'message'=>"Chantier enregistré — {$c->projet}",'data'=>$this->fmtCh($c)], 201);
    }

    private function fmtCh(SuiviChantier $c): array
    {
        return [
            'id'              => $c->id,
            'projet'          => $c->projet,
            'entrepreneur'    => $c->entrepreneur,
            'date_ouverture'  => $c->date_ouverture?->format('Y-m-d'),
            'date_prevue_fin' => $c->date_prevue_fin?->format('Y-m-d'),
            'date_visite'     => $c->date_visite?->format('Y-m-d') ?? $c->derniere_visite?->format('Y-m-d'),
            'taux_avancement' => $c->taux_avancement,
            'avancement'      => $c->taux_avancement,
            'derniere_visite' => $c->derniere_visite?->format('Y-m-d'),
            'statut'          => $c->statut,
            'observations'    => $c->observations,
            'recommandations' => $c->recommandations ?? null,
            'controleur'      => $c->controleur ?? null,
            'created_at'      => $c->created_at?->toISOString(),
        ];
    }
}
