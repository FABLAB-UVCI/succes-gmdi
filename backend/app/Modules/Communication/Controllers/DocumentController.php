<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
        $v = $request->validate([
            'titre'     => 'required|string|max:250',
            'type'      => 'required|in:photo,video,pdf,arrete,deliberation',
            'categorie' => 'required|string|max:100',
            'date'      => 'nullable|date',
            'auteur'    => 'nullable|string|max:150',
            'url'       => 'nullable|string|max:500',
            'droits'    => 'nullable|string|max:100',
            'photos'    => 'required_if:type,photo|array|min:1',
            'photos.*'  => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($request->hasFile('photos')) {
            $meta = ['titre'=>$v['titre'],'type'=>$v['type'],'categorie'=>$v['categorie'],'date'=>$v['date']??now()->format('Y-m-d'),'auteur'=>$v['auteur']??null,'droits'=>$v['droits']??null];
            $docs = [];
            foreach ($request->file('photos') as $file) {
                $path = $file->store('communication/photos', 'public');
                $docs[] = Document::create(array_merge($meta, ['url'=>Storage::disk('public')->url($path)]));
            }
            return response()->json(['success'=>true,'message'=>count($docs)." photo(s) enregistrée(s) — {$v['titre']}",'data'=>array_map(fn($d)=>$this->fmt($d), $docs)], 201);
        }

        $d = Document::create(array_merge($v, ['date'=>$v['date']??now()->format('Y-m-d')]));
        return response()->json(['success'=>true,'message'=>"Document enregistré — {$d->titre}",'data'=>$this->fmt($d)], 201);
    }

    private function fmt(Document $d): array
    {
        return ['id'=>$d->id,'titre'=>$d->titre,'type'=>$d->type,'categorie'=>$d->categorie,'date'=>$d->date?->format('Y-m-d'),'auteur'=>$d->auteur,'url'=>$d->url,'droits'=>$d->droits,'created_at'=>$d->created_at?->toISOString()];
    }
}
