<?php

namespace App\Http\Controllers\Api;


use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = $user->role?->name;

        // Projets accessibles à l'utilisateur
        $projectsQuery = Project::query();

        if ($role !== 'Admin') {
            $projectsQuery->where(function ($query) use ($user) {
                $query->where('created_by', $user->id)
                    ->orWhereHas('members', function ($memberQuery) use ($user) {
                        $memberQuery->where('users.id', $user->id);
                    });
            });
        }

        $projectIds = (clone $projectsQuery)->pluck('id');

        // Tâches des projets accessibles
        $tasksQuery = Task::whereIn('project_id', $projectIds);

        // Membre : uniquement les tâches qui lui sont assignées
        if ($role === 'Membre') {
            $tasksQuery->where('assigned_to', $user->id);
        }

        return response()->json([
            'projects' => [
                'total' => (clone $projectsQuery)->count(),
            ],
            'tasks' => [
                'total' => (clone $tasksQuery)->count(),

                'a_faire' => (clone $tasksQuery)
                    ->where('status', 'À faire')->count(),

                'en_cours' => (clone $tasksQuery)
                    ->where('status', 'En cours')->count(),

                'terminees' => (clone $tasksQuery)
                    ->where('status', 'Terminé')->count(),
            ],

            'my_assigned_tasks' => Task::where('assigned_to', $user->id)
                ->whereIn('project_id', $projectIds)
                ->count(),
        ]);
    }
}
