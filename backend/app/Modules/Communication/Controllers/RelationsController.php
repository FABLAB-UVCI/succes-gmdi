<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Partenaire;
use App\Modules\Communication\Models\ArticlePresse;
use Illuminate\Http\Request;

class RelationsController extends Controller
{
    use PaginationHelper;

    public function getPartenaires()
    {
        $data = Partenaire::orderByDesc('created_at')->paginate(20);
        return response()->json(['data'=>$data->map(fn($p)=>$this->fmtPart($p)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function createPartenaire(Request $request)
    {
        $v = $request->validate(['nom'=>'required|string|max:200','type'=>'required|string|max:100','domaine'=>'required|string|max:150','contact'=>'required|string|max:200','date_debut'=>'required|date']);
        $p = Partenaire::create(array_merge($v, ['statut'=>'actif']));
        return response()->json(['success'=>true,'message'=>"Partenaire enregistré — {$p->nom}",'data'=>$this->fmtPart($p)], 201);
    }

    public function getRevuePresse()
    {
        return response()->json(ArticlePresse::orderByDesc('date')->take(20)->get()->map(fn($a)=>['id'=>$a->id,'date'=>$a->date?->format('d/m/Y'),'media'=>$a->media,'titre'=>$a->titre,'type'=>$a->type,'tonalite'=>$a->tonalite,'created_at'=>$a->created_at?->toISOString()]));
    }

    public function envoyerDossierPresse(Request $request)
    {
        $v = $request->validate(['titre'=>'required|string|max:250','medias'=>'nullable|string','date_envoi'=>'nullable|date','contact'=>'nullable|string|max:200']);
        return response()->json(['success'=>true,'message'=>"Dossier de presse envoyé — {$v['titre']}",'data'=>null]);
    }

    public function getMedias()
    {
        return response()->json([]);
    }

    private function fmtPart(Partenaire $p): array
    {
        return ['id'=>$p->id,'nom'=>$p->nom,'type'=>$p->type,'domaine'=>$p->domaine,'contact'=>$p->contact,'date_debut'=>$p->date_debut?->format('Y-m-d'),'statut'=>$p->statut,'created_at'=>$p->created_at?->toISOString()];
    }
}
