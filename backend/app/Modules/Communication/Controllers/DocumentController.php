<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    use PaginationHelper;

    public function index(Request $request)
    {
        $q = Document::query()->orderByDesc('date');
        if ($t = $request->get('type'))   $q->where('type', $t);
        if ($s = $request->get('search')) $q->where('titre','like',"%$s%");
        $data = $q->paginate(30);
        return response()->json(['data'=>$data->map(fn($d)=>$this->fmt($d)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function byType($type)
    {
        return response()->json(Document::where('type',$type)->orderByDesc('date')->take(10)->get()->map(fn($d)=>$this->fmt($d)));
    }

    public function store(Request $request)
    {
        $v = $request->validate(['titre'=>'required|string|max:250','type'=>'required|in:photo,video,pdf,arrete,deliberation','categorie'=>'required|string|max:100','date'=>'nullable|date','auteur'=>'nullable|string|max:150','url'=>'nullable|string|max:500','droits'=>'nullable|string|max:100']);
        $d = Document::create(array_merge($v, ['date'=>$v['date']??now()->format('Y-m-d')]));
        return response()->json(['success'=>true,'message'=>"Document enregistré — {$d->titre}",'data'=>$this->fmt($d)], 201);
    }

    private function fmt(Document $d): array
    {
        return ['id'=>$d->id,'titre'=>$d->titre,'type'=>$d->type,'categorie'=>$d->categorie,'date'=>$d->date?->format('Y-m-d'),'auteur'=>$d->auteur,'url'=>$d->url,'droits'=>$d->droits,'created_at'=>$d->created_at?->toISOString()];
    }
}
