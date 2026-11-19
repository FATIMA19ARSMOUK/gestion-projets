<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    // Afficher les tâches des projets accessibles
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role?->name;

        $query = Task::with(['project', 'creator', 'assignee']);

        if ($role !== 'Admin') {
            $query->whereHas('project', function ($projectQuery) use ($user) {
                $projectQuery->where(function ($q) use ($user) {
                    $q->where('created_by', $user->id)
                        ->orWhereHas('members', function ($memberQuery) use ($user) {
                            $memberQuery->where('users.id', $user->id);
                        });
                });
            });
        }

        // Le membre voit uniquement ses tâches assignées
        if ($role === 'Membre') {
            $query->where('assigned_to', $user->id);
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $request->validate([
                'status' => ['in:À faire,En cours,Terminé'],
            ]);

            $query->where('status', $request->status);
        }

        if ($request->filled('priority')) {
            $request->validate([
                'priority' => ['in:Basse,Moyenne,Haute,Urgente'],
            ]);

            $query->where('priority', $request->priority);
        }

        if ($request->filled('project_id')) {
            $request->validate([
                'project_id' => ['integer', 'exists:projects,id'],
            ]);

            $query->where('project_id', $request->project_id);
        }

        return response()->json($query->latest()->get());
    }

    // Créer une tâche
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => ['required', 'integer', 'exists:projects,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'status' => ['sometimes', Rule::in(['À faire', 'En cours', 'Terminé'])],
            'priority' => ['sometimes', Rule::in(['Basse', 'Moyenne', 'Haute', 'Urgente'])],
            'deadline' => ['nullable', 'date'],
        ]);

        $user = $request->user();
        $project = Project::findOrFail($validated['project_id']);

        $isAdmin = $user->role?->name === 'Admin';
        $isChef = $user->role?->name === 'Chef de projet';

        $isProjectCreator =
            (int) $project->created_by === (int) $user->id;

        if (!$isAdmin && !($isChef && $isProjectCreator)) {
            return response()->json([
                'message' => 'Accès interdit : vous ne pouvez pas créer de tâche dans ce projet.',
            ], 403);
        }

        // Vérifier que le membre assigné appartient au projet
        if (
            !empty($validated['assigned_to']) &&
            !$project->members()
                ->where('users.id', $validated['assigned_to'])
                ->exists()
        ) {
            return response()->json([
                'message' => 'Le membre assigné doit appartenir au projet.',
            ], 422);
        }

        $task = Task::create([
            ...$validated,
            'created_by' => $user->id,
        ]);

        // Notifications après création de la tâche
        $recipients = [];

        // Tous les Admins
        $adminIds = User::whereHas('role', function ($query) {
            $query->where('name', 'Admin');
        })->pluck('id');

        foreach ($adminIds as $adminId) {
            $recipients[$adminId] = [
                'type' => 'task_created',
                'message' => 'Une nouvelle tâche a été créée : ' . $task->title,
            ];
        }

        // Chef créateur du projet
        if ((int) $project->created_by !== (int) $user->id) {
            $recipients[$project->created_by] = [
                'type' => 'task_created',
                'message' => 'Une nouvelle tâche a été créée dans votre projet : '
                    . $task->title,
            ];
        }

        // Membre assigné
        if (!empty($validated['assigned_to'])) {
            $recipients[$validated['assigned_to']] = [
                'type' => 'task_assigned',
                'message' => 'Une nouvelle tâche vous a été assignée : '
                    . $task->title,
            ];
        }

        foreach ($recipients as $recipientId => $notificationData) {
            if ((int) $recipientId === (int) $user->id) {
                continue;
            }

            Notification::create([
                'user_id' => $recipientId,
                'type' => $notificationData['type'],
                'message' => $notificationData['message'],
                'is_read' => false,
            ]);
        }

        return response()->json([
            'message' => 'Tâche créée avec succès.',
            'task' => $task->load(['project', 'creator', 'assignee']),
        ], 201);
    }

    // Modifier le statut d'une tâche
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        $task = Task::with('project')->findOrFail($id);

        $role = $user->role?->name;

        $isAdmin = $role === 'Admin';

        $isChef = $role === 'Chef de projet'
            && (int) $task->project->created_by === (int) $user->id;

        $isAssignedMember =
            (int) $task->assigned_to === (int) $user->id
            && $task->project->members()
                ->where('users.id', $user->id)
                ->exists();

        if (!$isAdmin && !$isChef && !$isAssignedMember) {
            return response()->json([
                'message' => 'Vous n’avez pas la permission de modifier cette tâche.',
            ], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['À faire', 'En cours', 'Terminé']),
            ],
        ]);

        // Éviter les notifications si le statut n'a pas changé
        $oldStatus = $task->status;
        $newStatus = $validated['status'];

        $task->status = $newStatus;
        $task->save();

        if ($oldStatus !== $newStatus) {
            $recipients = [];

            // Tous les Admins
            $adminIds = User::whereHas('role', function ($query) {
                $query->where('name', 'Admin');
            })->pluck('id');

            foreach ($adminIds as $adminId) {
                $recipients[$adminId] = [
                    'type' => 'task_status_updated',
                    'message' => 'Le statut de la tâche "' . $task->title
                        . '" a changé de ' . $oldStatus . ' à ' . $newStatus . '.',
                ];
            }

            // Chef créateur du projet
            $projectCreatorId = $task->project->created_by;

            $recipients[$projectCreatorId] = [
                'type' => 'task_status_updated',
                'message' => 'Le statut de la tâche "' . $task->title
                    . '" a changé de ' . $oldStatus . ' à ' . $newStatus . '.',
            ];

            // Membre assigné
            if ($task->assigned_to) {
                $recipients[$task->assigned_to] = [
                    'type' => 'task_status_updated',
                    'message' => 'Le statut de votre tâche "' . $task->title
                        . '" a changé de ' . $oldStatus . ' à ' . $newStatus . '.',
                ];
            }

            foreach ($recipients as $recipientId => $notificationData) {
                if ((int) $recipientId === (int) $user->id) {
                    continue;
                }

                Notification::create([
                    'user_id' => $recipientId,
                    'type' => $notificationData['type'],
                    'message' => $notificationData['message'],
                    'is_read' => false,
                ]);
            }
        }

        return response()->json([
            'message' => 'Statut modifié avec succès.',
            'task' => $task->fresh()->load([
                'project',
                'creator',
                'assignee',
            ]),
        ]);
    }
}

