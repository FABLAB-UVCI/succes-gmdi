<?php

namespace App\Http\Controllers;

use App\Models\Demarche;
use App\Support\GmdiAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DemarcheController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('citoyen') || $user->role === 'citoyen') {
            $rows = Demarche::query()
                ->where('user_id', $user->id)
                ->orderByDesc('updated_at')
                ->get();
        } else {
            // Manager or Admin viewing demarches
            $query = Demarche::query()->orderByDesc('updated_at');
            
            // If they are a manager, they should only see demarches for their allowed modules
            if ($user->hasRole('gestionnaire') || $user->role === 'gestionnaire') {
                $allowed = \App\Support\GmdiAccess::allowedModules($user);
                $query->whereIn('module', $allowed);
            }
            
            // Allow filtering by module
            if ($module = $request->get('module')) {
                $query->where('module', $module);
            }

            $rows = $query->get();
        }

        return response()->json(['data' => $rows->map(fn (Demarche $d) => $this->fmt($d))]);
    }

    public function update(Request $request, Demarche $demarche): JsonResponse
    {
        $user = $request->user();
        
        // Only managers/admins can update demarches
        if ($user->hasRole('citoyen') || $user->role === 'citoyen') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $v = $request->validate([
            'statut' => ['required', 'string', \Illuminate\Validation\Rule::in(Demarche::STATUTS)],
            'commentaire' => ['nullable', 'string', 'max:1000'],
            'extra_donnees' => ['nullable', 'array'],
        ]);

        $donnees = $demarche->donnees ?? [];
        if (!empty($v['extra_donnees'])) {
            $donnees = array_merge($donnees, $v['extra_donnees']);
        }

        $demarche->update([
            'statut' => $v['statut'],
            'donnees' => $donnees,
            'commentaire_gestionnaire' => $v['commentaire'] ?? $demarche->commentaire_gestionnaire,
        ]);

        // 1. Envoi de l'e-mail au citoyen
        try {
            \Illuminate\Support\Facades\Mail::to($demarche->user->email)->send(new \App\Mail\DemarcheStatusUpdated($demarche));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Erreur envoi email: " . $e->getMessage());
        }

        // 2. Génération de PDF selon le type d'acte validé
        $pdfTypes = [
            "Demande d'acte de naissance"        => 'pdf.acte_naissance',
            "Demande d'acte de mariage"          => 'pdf.acte_mariage',
            "Demande d'acte de décès"            => 'pdf.acte_deces',
            "Certificat de célibat"              => 'pdf.certificat',
            "Certificat de résidence"            => 'pdf.certificat',
            "Certificat de vie individuelle"     => 'pdf.certificat',
            "Jugement supplétif"                 => 'pdf.acte_jugement',
            "Demande d'adoption"                 => 'pdf.acte_adoption',
            "Paiement de taxe municipale"         => 'pdf.recu_paiement',
            "Règlement de facture"                => 'pdf.recu_paiement',
        ];
        $certifTypeLabels = [
            "Certificat de célibat"          => 'Célibat',
            "Certificat de résidence"        => 'Résidence',
            "Certificat de vie individuelle" => 'Vie',
        ];

        if ($demarche->statut === 'valide' && isset($pdfTypes[$demarche->type_demarche])) {
            try {
                $view     = $pdfTypes[$demarche->type_demarche];
                $viewData = ['demarche' => $demarche];
                if (isset($certifTypeLabels[$demarche->type_demarche])) {
                    $viewData['certifType'] = $certifTypeLabels[$demarche->type_demarche];
                }
                $pdf      = \Barryvdh\DomPDF\Facade\Pdf::loadView($view, $viewData);
                $filename = 'acte_' . $demarche->reference . '.pdf';
                $path     = 'documents_officiels/' . $filename;
                \Illuminate\Support\Facades\Storage::disk('public')->put($path, $pdf->output());

                $donnees = $demarche->donnees ?? [];
                $donnees['document_officiel'] = asset('storage/' . $path);
                $demarche->update(['donnees' => $donnees]);

                // Créer une notification pour le citoyen
                \App\Models\Notification::create([
                    'user_id'     => $demarche->user_id,
                    'titre'       => '✅ Document officiel disponible',
                    'message'     => 'Votre ' . $demarche->type_demarche . ' (Réf: ' . $demarche->reference . ') a été validée. Le document officiel est prêt à être téléchargé.',
                    'type'        => 'success',
                    'icone'       => 'ti ti-file-certificate',
                    'demarche_id' => $demarche->id,
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error("Erreur génération PDF: " . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut mis à jour et notifications envoyées.',
            'data' => $this->fmt($demarche),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (! $user->hasRole('citoyen') && $user->role !== 'citoyen') {
            return response()->json(['message' => 'Réservé au portail citoyen.'], 403);
        }

        $v = $request->validate([
            'module' => ['required', 'string', Rule::in(GmdiAccess::MODULES_CITOYEN)],
            'type_demarche' => 'nullable|string|max:120',
            'files.*' => 'nullable|file|mimes:pdf,jpg,jpeg,png,webp,heic,heif,gif|max:10240',
        ]);

        $donnees = [];
        if ($request->has('donnees')) {
            $donneesRaw = $request->get('donnees');
            $donnees = is_string($donneesRaw) ? json_decode($donneesRaw, true) : (array)$donneesRaw;
        }

        $pieces_jointes = [];
        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Generate a unique, non-guessable name for the file
                $filename = \Illuminate\Support\Str::random(40) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('demarches/' . date('Y-m-d'), $filename, 'public');
                $pieces_jointes[] = [
                    'nom' => $file->getClientOriginalName(),
                    'url' => asset('storage/' . $path)
                ];
            }
        }

        if (count($pieces_jointes) > 0) {
            $donnees['pieces_jointes'] = $pieces_jointes;
        }

        $d = Demarche::create([
            'user_id' => $user->id,
            'reference' => Demarche::generateReference(),
            'module' => $v['module'],
            'type_demarche' => $v['type_demarche'] ?? null,
            'donnees' => empty($donnees) ? null : $donnees,
            'statut' => 'en_attente',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Demande enregistrée.',
            'data' => $this->fmt($d),
        ], 201);
    }

    private function fmt(Demarche $d): array
    {
        return [
            'id' => $d->id,
            'reference' => $d->reference,
            'module' => $d->module,
            'type_demarche' => $d->type_demarche,
            'statut' => $d->statut,
            'donnees' => $d->donnees,
            'commentaire_gestionnaire' => $d->commentaire_gestionnaire,
            'demandeur' => $d->user?->name,
            'demandeur_telephone' => $d->user?->telephone ?? null,
            'created_at' => $d->created_at?->toIso8601String(),
            'updated_at' => $d->updated_at?->toIso8601String(),
        ];
    }

    public function downloadDocument(Request $request, Demarche $demarche)
    {
        $user = $request->user();

        // Security check: only the owner or a manager/admin can download
        if ($user->hasRole('citoyen') || $user->role === 'citoyen') {
            if ($demarche->user_id !== $user->id) {
                return response()->json(['message' => 'Non autorisé.'], 403);
            }
        }

        if (empty($demarche->donnees['document_officiel'])) {
            return response()->json(['message' => 'Aucun document officiel généré pour cette démarche.'], 404);
        }

        $url = $demarche->donnees['document_officiel'];
        // The URL is like http://localhost:8000/storage/documents_officiels/acte_REF.pdf
        // We need to get the path relative to the storage disk
        $path = str_replace(asset('storage') . '/', '', $url);

        if (!\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Le fichier est introuvable sur le serveur.'], 404);
        }

        return \Illuminate\Support\Facades\Storage::disk('public')->download($path);
    }
}
