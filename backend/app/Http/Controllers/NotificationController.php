<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Retourne toutes les notifications du citoyen connecté.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn($n) => [
                'id'         => $n->id,
                'titre'      => $n->titre,
                'message'    => $n->message,
                'type'       => $n->type,
                'icone'      => $n->icone,
                'lu'         => $n->lu,
                'demarche_id'=> $n->demarche_id,
                'date'       => $n->created_at->diffForHumans(),
            ]);

        $nonLues = Notification::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->count();

        return response()->json([
            'success'  => true,
            'data'     => $notifications,
            'non_lues' => $nonLues,
        ]);
    }

    /**
     * Marquer une notification comme lue.
     */
    public function markRead(Request $request, Notification $notification): JsonResponse
    {
        // Vérifier que la notification appartient bien à l'utilisateur
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $notification->update(['lu' => true]);

        return response()->json(['success' => true]);
    }

    /**
     * Marquer toutes les notifications comme lues.
     */
    public function markAllRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('lu', false)
            ->update(['lu' => true]);

        return response()->json(['success' => true, 'message' => 'Toutes les notifications marquées comme lues.']);
    }
}
