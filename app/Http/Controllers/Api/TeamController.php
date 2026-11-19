<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Project;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;

class TeamController extends Controller
{
    // Afficher les membres selon le rôle connecté
    public function index(Request $request)
    {
        $currentUser = $request->user();
        $role = $currentUser->role?->name;

        // Admin : afficher tous les utilisateurs
        if ($role === 'Admin') {
            $users = User::with('role')
                ->withCount('projects')
                ->latest()
                ->get();

            return response()->json($users);
        }

        // Chef de projet
        if ($role === 'Chef de projet') {
            $projects = Project::with('members')
                ->where('created_by', $currentUser->id)
                ->get();
        }

        // Membre
        elseif ($role === 'Membre') {
            $projects = $currentUser->projects()
                ->with('members')
                ->get();
        } else {
            return response()->json([
                'message' => 'Rôle non autorisé.'
            ], 403);
        }

        $userIds = $projects->flatMap(function ($project) {
            return $project->members->pluck('id')
                ->push($project->created_by);
        })->unique()->values();

        $userIds->push($currentUser->id);
        $userIds = $userIds->unique()->values();

        $users = User::with('role')
            ->withCount('projects')
            ->whereIn('id', $userIds)
            ->latest()
            ->get();

        return response()->json($users);
    }

    // Ajouter un nouvel utilisateur (Admin uniquement)
    public function store(Request $request)
    {
        if ($request->user()->role?->name !== 'Admin') {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à ajouter un utilisateur.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => [
                'required',
                Rule::in(['Membre', 'Chef de projet']),
            ],
        ]);

        $role = Role::where('name', $validated['role'])->first();

        if (!$role) {
            return response()->json([
                'message' => 'Le rôle sélectionné est introuvable.'
            ], 422);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
        ]);

        return response()->json([
            'message' => 'Utilisateur ajouté avec succès.',
            'user' => $user->load('role'),
        ], 201);
    }

    // Modifier un membre (Admin uniquement)
    public function update(Request $request, $id)
    {
        if ($request->user()->role?->name !== 'Admin') {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à modifier cet utilisateur.'
            ], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => [
                'required',
                Rule::in(['Membre', 'Chef de projet']),
            ],
        ]);

        $role = Role::where('name', $validated['role'])->first();

        if (!$role) {
            return response()->json([
                'message' => 'Le rôle sélectionné est introuvable.'
            ], 422);
        }

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role_id' => $role->id,
        ]);

        return response()->json([
            'message' => 'Utilisateur modifié avec succès.',
            'user' => $user->load('role'),
        ]);
    }

    // Supprimer un membre (Admin uniquement)
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role?->name !== 'Admin') {
            return response()->json([
                'message' => 'Vous n\'êtes pas autorisé à supprimer cet utilisateur.'
            ], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.'
            ], 422);
        }

        try {
            $user->delete();

            return response()->json([
                'message' => 'Utilisateur supprimé avec succès.'
            ]);

        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Impossible de supprimer cet utilisateur car il est lié à des projets ou des tâches.'
            ], 409);
        }
    }
}

