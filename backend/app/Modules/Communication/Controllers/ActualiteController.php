<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Actualite;
use App\Support\GmdiAccess;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ActualiteController extends Controller
{
    use PaginationHelper;

    /** @return list<string> */
    private function audienceValues(): array
    {
        return array_merge(['public', 'tous_services'], GmdiAccess::MODULES);
    }

    public function index(Request $request)
    {
        $q = Actualite::query()->orderByDesc('date');
        if ($t = $request->get('type'))   $q->where('type', $t);
        if ($s = $request->get('statut')) $q->where('statut', $s);
        if ($sr= $request->get('search')) $q->where('titre','like',"%$sr%");
        $data = $q->paginate((int)$request->get('per_page', 20));
        return response()->json(['data'=>$data->map(fn($a)=>$this->fmt($a)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'type'      => 'required|in:communique,annonce,evenement',
            'titre'     => 'required|string|max:250',
            'contenu'   => 'required|string',
            'auteur'    => 'nullable|string|max:150',
            'statut'    => 'nullable|in:publie,brouillon',
            'categorie' => 'nullable|string|max:100',
            'date'      => 'nullable|date',
            'audience'  => ['nullable', Rule::in($this->audienceValues())],
        ]);
        $a = Actualite::create(array_merge($v, [
            'statut'   => $v['statut'] ?? 'publie',
            'auteur'   => $v['auteur'] ?? 'Service Communication',
            'date'     => $v['date']   ?? now()->format('Y-m-d'),
            'audience' => $v['audience'] ?? 'public',
        ]));
        return response()->json(['success'=>true,'message'=>"Publication créée — {$a->titre}",'data'=>$this->fmt($a)], 201);
    }

    public function update(Request $request, $id)
    {
        $a = Actualite::findOrFail($id);
        $v = $request->validate([
            'type'      => 'required|in:communique,annonce,evenement',
            'titre'     => 'required|string|max:250',
            'contenu'   => 'required|string',
            'auteur'    => 'nullable|string|max:150',
            'statut'    => 'nullable|in:publie,brouillon',
            'categorie' => 'nullable|string|max:100',
            'date'      => 'nullable|date',
            'audience'  => ['nullable', Rule::in($this->audienceValues())],
        ]);
        $a->update($v);
        return response()->json(['success'=>true,'message'=>"Publication mise à jour — {$a->titre}",'data'=>$this->fmt($a->fresh())]);
    }

    public function updateStatut(Request $request, $id)
    {
        $a = Actualite::findOrFail($id);
        $request->validate(['statut'=>'required|in:publie,brouillon']);
        $a->update(['statut'=>$request->statut]);
        return response()->json(['success'=>true,'message'=>"Statut mis à jour — {$a->titre}",'data'=>$this->fmt($a->fresh())]);
    }

    public function destroy($id)
    {
        Actualite::findOrFail($id)->delete();
        return response()->json(['success'=>true,'message'=>'Publication supprimée.','data'=>null]);
    }

    private function fmt(Actualite $a): array
    {
        return ['id'=>$a->id,'type'=>$a->type,'titre'=>$a->titre,'contenu'=>$a->contenu,'auteur'=>$a->auteur,'date'=>$a->date?->format('Y-m-d'),'statut'=>$a->statut,'categorie'=>$a->categorie,'audience'=>$a->audience,'created_at'=>$a->created_at?->toISOString()];
    }
}
