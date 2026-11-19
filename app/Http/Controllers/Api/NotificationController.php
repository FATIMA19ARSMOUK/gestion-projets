<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;


class NotificationController extends Controller
{
    // Afficher les notifications de l'utilisateur connecté
    public function index(Request $request)
    {
        $notifications = Notification::where(
            'user_id',
            $request->user()->id
        )
            ->latest()
            ->get();

        return response()->json($notifications);
    }

    // Marquer une notification comme lue
    public function markAsRead(Request $request, Notification $notification)
    {
        // Vérifier que la notification appartient à l'utilisateur connecté
        if ($notification->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Accès interdit à cette notification.',
            ], 403);
        }

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'notification' => $notification->fresh(),
        ]);
    }
    // Marquer toutes les notifications comme lues
public function markAllAsRead(Request $request)
{
    Notification::where('user_id', $request->user()->id)
        ->where('is_read', false)
        ->update(['is_read' => true]);

    return response()->json([
        'message' => 'Toutes les notifications ont été marquées comme lues.',
    ]);
}
}
