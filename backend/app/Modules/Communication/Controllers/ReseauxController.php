<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\CompteReseau;
use App\Modules\Communication\Models\PostProgramme;
use Illuminate\Http\Request;

class ReseauxController extends Controller
{
    public function getComptes()
    {
        return response()->json(CompteReseau::orderBy('abonnes','desc')->get()->map(fn($c)=>$this->fmtC($c)));
    }

    public function getCalendrier()
    {
        return response()->json(PostProgramme::orderBy('date')->get()->map(fn($p)=>$this->fmtP($p)));
    }

    public function publierPost(Request $request)
    {
        $v = $request->validate(['contenu'=>'required|string','plateformes'=>'required|array','plateformes.*'=>'string','programme'=>'nullable|boolean','date'=>'nullable|string']);
        $p = PostProgramme::create([
            'date'        => ($v['programme'] ?? false) ? ($v['date'] ?? now()->format('Y-m-d')) : now()->format('Y-m-d'),
            'contenu'     => $v['contenu'],
            'plateformes' => implode(',', $v['plateformes']),
            'responsable' => auth()->user()?->name ?? 'Service Communication',
            'statut'      => ($v['programme'] ?? false) ? 'programme' : 'publie',
        ]);
        CompteReseau::whereIn('plateforme', $v['plateformes'])->increment('publications');
        return response()->json(['success'=>true,'message'=>'Publié sur : '.implode(', ',$v['plateformes']),'data'=>$this->fmtP($p)], 201);
    }

    public function ajouterCalendrier(Request $request)
    {
        $v = $request->validate(['date'=>'required|date','contenu'=>'required|string','plateformes'=>'required|array','responsable'=>'nullable|string']);
        $p = PostProgramme::create(['date'=>$v['date'],'contenu'=>$v['contenu'],'plateformes'=>implode(',',$v['plateformes']),'responsable'=>$v['responsable']??'Service Comm.','statut'=>'programme']);
        return response()->json(['success'=>true,'message'=>'Post ajouté au calendrier','data'=>$this->fmtP($p)], 201);
    }

    private function fmtC(CompteReseau $c): array
    {
        return ['id'=>$c->id,'plateforme'=>$c->plateforme,'nom'=>$c->nom,'handle'=>$c->handle,'abonnes'=>$c->abonnes,'publications'=>$c->publications,'taux_engagement'=>$c->taux_engagement,'porte_mois'=>$c->porte_mois,'dernier_post'=>$c->dernier_post,'created_at'=>$c->created_at?->toISOString()];
    }

    private function fmtP(PostProgramme $p): array
    {
        return ['id'=>$p->id,'date'=>$p->date?->format('Y-m-d'),'contenu'=>$p->contenu,'plateformes'=>$p->plateformes,'responsable'=>$p->responsable,'statut'=>$p->statut,'created_at'=>$p->created_at?->toISOString()];
    }
}
