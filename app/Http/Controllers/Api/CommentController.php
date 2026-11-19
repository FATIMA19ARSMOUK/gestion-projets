<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Task;
use App\Models\Notification;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // Vérifier si l'utilisateur peut accéder à la tâche
    private function canAccessTask($user, Task $task): bool
    {
        $project = $task->project;

        if ($user->role?->name === 'Admin') {
            return true;
        }

        if (
            $user->role?->name === 'Chef de projet' &&
            (int) $project->created_by === (int) $user->id
        ) {
            return true;
        }

        return $project->members()
            ->where('users.id', $user->id)
            ->exists();
    }

    // Afficher les commentaires d'une tâche
    public function index(Request $request, Task $task)
    {
        if (!$this->canAccessTask($request->user(), $task)) {
            return response()->json([
                'message' => 'Accès interdit à cette tâche.',
            ], 403);
        }

        $comments = $task->comments()
            ->with('user:id,name')
            ->latest()
            ->get();

        return response()->json($comments);
    }

    // Ajouter un commentaire à une tâche
    public function store(Request $request, Task $task)
    {
        if (!$this->canAccessTask($request->user(), $task)) {
            return response()->json([
                'message' => 'Accès interdit à cette tâche.',
            ], 403);
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        $comment = Comment::create([
            'task_id' => $task->id,
            'user_id' => $user->id,
            'content' => $validated['content'],
        ]);

        // Récupérer le chef créateur du projet
        $project = $task->project;

        $chefId = $project->created_by;

        // Récupérer le membre assigné à la tâche
        $assignedMemberId = $task->assigned_to;

        // Destinataires des notifications
        $recipients = collect([
            $chefId,
            $assignedMemberId,
        ])
            ->filter()
            ->unique()
            ->reject(fn ($id) => (int) $id === (int) $user->id);

        foreach ($recipients as $recipientId) {
            Notification::create([
                'user_id' => $recipientId,
                'type' => 'new_comment',
                'message' => $user->name
                    . ' a ajouté un commentaire sur la tâche : '
                    . $task->title,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Commentaire ajouté avec succès.',
            'comment' => $comment->load('user:id,name'),
        ], 201);
    }
}
