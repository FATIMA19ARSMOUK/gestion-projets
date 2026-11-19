<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Notification;

class ProjectController extends Controller
{
    // Afficher la liste des projets accessibles
    public function index(Request $request)
{
    $user = $request->user();

    if ($user->role?->name === 'Admin') {
        $projects = Project::with(['creator', 'members'])
            ->latest()
            ->get();
    } else {
        $projects = Project::with(['creator', 'members'])
            ->where(function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('members', function ($memberQuery) use ($user) {
                        $memberQuery->where('users.id', $user->id);
                    });
            })
            ->latest()
            ->get();
    }

    return response()->json($projects);
}

    // Créer un nouveau projet
    // Créer un nouveau projet
public function store(Request $request)
{
    $user = $request->user();

    if (!in_array($user->role?->name, ['Admin', 'Chef de projet'], true)) {
        return response()->json([
            'message' => 'Accès interdit : vous ne pouvez pas créer de projet.',
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'status' => 'sometimes|in:À venir,En cours,Terminé',
    ]);

    $project = Project::create([
        ...$validated,
        'created_by' => $user->id,
    ]);

    // Notifier tous les Admins lorsqu'un Chef crée un projet
    if ($user->role?->name === 'Chef de projet') {

        $admins = User::whereHas('role', function ($query) {
            $query->where('name', 'Admin');
        })->get();

        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'project_created',
                'message' => 'Un nouveau projet a été créé : '
                    . $project->name
                    . ' par ' . $user->name,
                'is_read' => false,
            ]);
        }
    }

    return response()->json([
        'message' => 'Projet créé avec succès.',
        'project' => $project->load('creator', 'members'),
    ], 201);
}
// Modifier un projet
public function update(Request $request, Project $project)
{
    $user = $request->user();

    // Admin peut modifier tous les projets
    // Chef de projet peut modifier uniquement ses projets
    if (
        $user->role?->name !== 'Admin' &&
        !(
            $user->role?->name === 'Chef de projet' &&
            $project->created_by === $user->id
        )
    ) {
        return response()->json([
            'message' => 'Accès interdit : vous ne pouvez pas modifier ce projet.',
        ], 403);
    }

    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:255',
        'description' => 'sometimes|nullable|string',
        'start_date' => 'sometimes|nullable|date',
        'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
        'status' => 'sometimes|in:À venir,En cours,Terminé',
    ]);

    $project->update($validated);

    return response()->json([
        'message' => 'Projet modifié avec succès.',
        'project' => $project->load('creator', 'members'),
    ]);
}


// Supprimer un projet
public function destroy(Request $request, Project $project)
{
    $user = $request->user();

    // Seul l'Admin peut supprimer un projet
    if ($user->role?->name !== 'Admin') {
        return response()->json([
            'message' => 'Accès interdit : seul l\'Admin peut supprimer un projet.',
        ], 403);
    }

    // Supprimer les relations avec les membres
    $project->members()->detach();

    $project->delete();

    return response()->json([
        'message' => 'Projet supprimé avec succès.',
    ]);
}
    // Ajouter un membre à un projet
 // Ajouter un membre à un projet
public function addMember(Request $request, Project $project)
{
    $user = $request->user();

    // Seuls l'Admin et le Chef de projet créateur peuvent ajouter des membres
    if (
        $user->role?->name !== 'Admin' &&
        !(
            $user->role?->name === 'Chef de projet' &&
            $project->created_by === $user->id
        )
    ) {
        return response()->json([
            'message' => 'Accès interdit.',
        ], 403);
    }

    $validated = $request->validate([
        'user_id' => 'required|integer|exists:users,id',
    ]);

    // Éviter d'ajouter deux fois le même membre
    if ($project->members()->where('users.id', $validated['user_id'])->exists()) {
        return response()->json([
            'message' => 'Cet utilisateur est déjà membre du projet.',
        ], 422);
    }

    // Ajouter le membre
    $project->members()->attach($validated['user_id']);

    // Créer une notification pour le membre ajouté
    Notification::create([
        'user_id' => $validated['user_id'],
        'type' => 'member_added',
        'message' => 'Vous avez été ajouté(e) au projet : ' . $project->name,
        'is_read' => false,
    ]);

    return response()->json([
        'message' => 'Membre ajouté au projet avec succès.',
        'project' => $project->load('creator', 'members'),
    ], 200);
}
    // Retirer un membre d'un projet
public function removeMember(Request $request, Project $project, $userId)
{
    $user = $request->user();

    // Seuls Admin et le Chef créateur peuvent retirer un membre
    if (
        $user->role?->name !== 'Admin' &&
        !(
            $user->role?->name === 'Chef de projet' &&
            $project->created_by === $user->id
        )
    ) {
        return response()->json([
            'message' => 'Accès interdit.',
        ], 403);
    }

    // Vérifier que l'utilisateur existe
    $request->validate([
        'user_id' => 'nullable',
    ]);

    if (!\App\Models\User::where('id', $userId)->exists()) {
        return response()->json([
            'message' => 'Utilisateur introuvable.',
        ], 404);
    }

    // Vérifier que le membre appartient au projet
    if (!$project->members()->where('users.id', $userId)->exists()) {
        return response()->json([
            'message' => "Cet utilisateur n'est pas membre du projet.",
        ], 404);
    }

    $project->members()->detach($userId);
    Notification::create([
    'user_id' => $userId,
    'type' => 'member_removed',
    'message' => 'Vous avez été retiré(e) du projet : ' . $project->name,
    'is_read' => false,
]);
    // Notifier le Chef de projet créateur
if ($project->created_by !== $user->id) {
    $removedMember = User::find($userId);

    Notification::create([
        'user_id' => $project->created_by,
        'type' => 'member_removed',
        'message' => $removedMember->name . ' a été retiré(e) du projet : ' . $project->name,
        'is_read' => false,
    ]);
}

    return response()->json([
        'message' => 'Membre retiré du projet avec succès.',
        'project' => $project->load('creator', 'members'),
    ]);
}

// Afficher les utilisateurs disponibles pour un projet
public function availableMembers(Request $request, Project $project)
{
    $user = $request->user();

    // Vérifier les permissions
    if (
        $user->role?->name !== 'Admin' &&
        !(
            $user->role?->name === 'Chef de projet' &&
            $project->created_by === $user->id
        )
    ) {
        return response()->json([
            'message' => 'Accès interdit.',
        ], 403);
    }

    // Récupérer les membres déjà inscrits
    $memberIds = $project->members()->pluck('users.id');

    // Récupérer les utilisateurs qui ne sont pas encore membres
    $availableUsers = User::with('role:id,name')
        ->select('id', 'name', 'email', 'role_id')
        ->whereNotIn('id', $memberIds)
        ->where('id', '!=', $project->created_by)
        ->orderBy('name')
        ->get();

    return response()->json($availableUsers);
}
// Un membre quitte le projet
public function leaveProject(Request $request, Project $project)
{
    $user = $request->user();

    // Vérifier que l'utilisateur est membre du projet
    if (!$project->members()->where('users.id', $user->id)->exists()) {
        return response()->json([
            'message' => "Vous n'êtes pas membre de ce projet.",
        ], 404);
    }

    // Retirer le membre du projet
    $project->members()->detach($user->id);

    // Notifier le Chef de projet créateur
    if ($project->created_by !== $user->id) {
        Notification::create([
            'user_id' => $project->created_by,
            'type' => 'member_left',
            'message' => $user->name . ' a quitté le projet : ' . $project->name,
            'is_read' => false,
        ]);
    }

    return response()->json([
        'message' => 'Vous avez quitté le projet avec succès.',
    ]);
}
}