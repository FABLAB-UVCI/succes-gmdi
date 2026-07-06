<?php

namespace App\Modules\Communication\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Communication\Models\CampagneSms;
use Illuminate\Http\Request;

class SmsController extends Controller
{
    private const NB = ['tous'=>12500,'quartier'=>3800,'commercants'=>2400,'agents'=>347,'contribuables'=>8200];

    public function getHistorique()
    {
        return response()->json(CampagneSms::orderByDesc('date_envoi')->take(50)->get()->map(fn($s)=>$this->fmt($s)));
    }

    public function lancerCampagne(Request $request)
    {
        $v = $request->validate(['nom'=>'required|string|max:200','type'=>'required|string|max:50','message'=>'required|string|max:480','destinataires'=>'required|string|max:100','date_envoi'=>'nullable|string','programme'=>'nullable|boolean']);
        $nb   = self::NB[$v['destinataires']] ?? 0;
        $prog = $v['programme'] ?? false;
        $c = CampagneSms::create([
            'nom'              => $v['nom'],
            'type'             => $v['type'],
            'message'          => $v['message'],
            'destinataires'    => $v['destinataires'],
            'nb_destinataires' => $nb,
            'date_envoi'       => $prog ? ($v['date_envoi'] ?? now()->format('Y-m-d')) : now()->format('Y-m-d'),
            'statut'           => $prog ? 'programme' : 'envoye',
            'taux_livraison'   => $prog ? 0 : 94,
        ]);
        return response()->json(['success'=>true,'message'=>$prog?"Campagne programmée — {$c->nom}":"Campagne envoyée à ".number_format($nb)." destinataires",'data'=>$this->fmt($c)], 201);
    }

    public function envoyerAlerte(Request $request)
    {
        $v = $request->validate(['message'=>'required|string|max:160','cible'=>'required|string|max:100','quartier'=>'nullable|string','priorite'=>'nullable|string|max:50']);
        $nb = self::NB[$v['cible']] ?? 0;
        $c = CampagneSms::create([
            'nom'              => 'ALERTE — '.substr($v['message'], 0, 40).'...',
            'type'             => 'alerte',
            'message'          => $v['message'],
            'destinataires'    => $v['cible'],
            'nb_destinataires' => $nb,
            'date_envoi'       => now()->format('Y-m-d'),
            'statut'           => 'envoye',
            'taux_livraison'   => 97,
        ]);
        return response()->json(['success'=>true,'message'=>"Alerte envoyée à ".number_format($nb)." destinataires",'data'=>$this->fmt($c)], 201);
    }

    public function export()
    {
        return response()->streamDownload(fn()=>print(json_encode(CampagneSms::all(),JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE)), 'sms_'.now()->format('Y-m-d').'.json', ['Content-Type'=>'application/json']);
    }

    private function fmt(CampagneSms $s): array
    {
        return ['id'=>$s->id,'nom'=>$s->nom,'type'=>$s->type,'message'=>$s->message,'destinataires'=>$s->destinataires,'nb_destinataires'=>$s->nb_destinataires,'date_envoi'=>$s->date_envoi?->format('Y-m-d'),'statut'=>$s->statut,'taux_livraison'=>$s->taux_livraison,'created_at'=>$s->created_at?->toISOString()];
    }
}
