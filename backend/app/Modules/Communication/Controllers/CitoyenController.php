<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\Reclamation;
use App\Modules\Communication\Models\Suggestion;
use App\Modules\Communication\Models\ConsultationPublique;
use Illuminate\Http\Request;

class CitoyenController extends Controller
{
    use PaginationHelper;

    // ── Réclamations ──────────────────────────────────────────────────────────

    public function indexReclamations(Request $request)
    {
        $q = Reclamation::query()->orderByDesc('date');
        if ($s = $request->get('statut'))  $q->where('statut', $s);
        if ($sv= $request->get('service')) $q->where('service', $sv);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($r)=>$this->fmtRec($r)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeReclamation(Request $request)
    {
        $v = $request->validate(['objet'=>'required|string|max:250','demandeur'=>'required|string|max:200','service'=>'required|string|max:100','canal'=>'required|string|max:50']);
        $seq = str_pad(Reclamation::count() + 1, 3, '0', STR_PAD_LEFT);
        $r = Reclamation::create(array_merge($v, ['reference'=>'RCL-'.date('Y')."-{$seq}",'date'=>now()->format('Y-m-d'),'statut'=>'en_traitement']));
        return response()->json(['success'=>true,'message'=>"Réclamation enregistrée — {$r->reference}",'data'=>$this->fmtRec($r)], 201);
    }

    public function updateStatutReclamation(Request $request, $id)
    {
        $r = Reclamation::findOrFail($id);
        $request->validate(['statut'=>'required|in:en_traitement,repondu,cloture']);
        $r->update(['statut'=>$request->statut]);
        return response()->json(['success'=>true,'message'=>"Statut mis à jour — {$r->reference}",'data'=>$this->fmtRec($r->fresh())]);
    }

    public function exportReclamations()
    {
        return response()->streamDownload(function() { echo json_encode(Reclamation::all(), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE); }, 'reclamations_'.now()->format('Y-m-d').'.json', ['Content-Type'=>'application/json']);
    }

    private function fmtRec(Reclamation $r): array
    {
        return ['id'=>$r->id,'reference'=>$r->reference,'objet'=>$r->objet,'demandeur'=>$r->demandeur,'service'=>$r->service,'canal'=>$r->canal,'date'=>$r->date?->format('Y-m-d'),'statut'=>$r->statut,'created_at'=>$r->created_at?->toISOString()];
    }

    // ── Suggestions ───────────────────────────────────────────────────────────

    public function indexSuggestions(Request $request)
    {
        $q = Suggestion::query()->orderByDesc('date');
        if ($s = $request->get('statut')) $q->where('statut', $s);
        $data = $q->paginate(20);
        return response()->json(['data'=>$data->map(fn($s)=>$this->fmtSug($s)),'meta'=>$this->meta($data),'links'=>$this->links($data)]);
    }

    public function storeSuggestion(Request $request)
    {
        $v = $request->validate(['objet'=>'required|string|max:250','citoyen'=>'nullable|string|max:150','description'=>'nullable|string|max:500']);
        $seq = str_pad(Suggestion::count() + 1, 3, '0', STR_PAD_LEFT);
        $s = Suggestion::create(array_merge($v, ['reference'=>'SUG-'.date('Y')."-{$seq}",'citoyen'=>$v['citoyen']??'Anonyme','date'=>now()->format('Y-m-d'),'statut'=>'recu']));
        return response()->json(['success'=>true,'message'=>"Suggestion enregistrée — {$s->reference}",'data'=>$this->fmtSug($s)], 201);
    }

    public function transmettresuggestion($id)
    {
        $s = Suggestion::findOrFail($id);
        $s->update(['statut'=>'transmis']);
        return response()->json(['success'=>true,'message'=>"Suggestion transmise — {$s->reference}",'data'=>$this->fmtSug($s->fresh())]);
    }

    private function fmtSug(Suggestion $s): array
    {
        return ['id'=>$s->id,'reference'=>$s->reference,'objet'=>$s->objet,'citoyen'=>$s->citoyen,'description'=>$s->description,'date'=>$s->date?->format('Y-m-d'),'statut'=>$s->statut,'created_at'=>$s->created_at?->toISOString()];
    }

    // ── Consultations ─────────────────────────────────────────────────────────

    public function indexConsultations()
    {
        return response()->json(ConsultationPublique::orderByDesc('date_ouverture')->get()->map(fn($c)=>$this->fmtCons($c)));
    }

    public function storeConsultation(Request $request)
    {
        $v = $request->validate(['titre'=>'required|string|max:250','theme'=>'required|string|max:100','date_ouverture'=>'required|date','date_cloture'=>'required|date|after:date_ouverture','canaux'=>'nullable|string|max:100']);
        $c = ConsultationPublique::create(array_merge($v, ['participants'=>0,'statut'=>now()->format('Y-m-d')>=$v['date_ouverture']?'actif':'programme']));
        return response()->json(['success'=>true,'message'=>"Consultation ouverte — {$c->titre}",'data'=>$this->fmtCons($c)], 201);
    }

    private function fmtCons(ConsultationPublique $c): array
    {
        return ['id'=>$c->id,'titre'=>$c->titre,'theme'=>$c->theme,'date_ouverture'=>$c->date_ouverture?->format('Y-m-d'),'date_cloture'=>$c->date_cloture?->format('Y-m-d'),'participants'=>$c->participants,'statut'=>$c->statut,'canaux'=>$c->canaux,'created_at'=>$c->created_at?->toISOString()];
    }
}
