
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TeamController;

// Routes publiques
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Routes protégées par Sanctum
Route::middleware('auth:sanctum')->group(function () {

    // Authentification
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user()->load('role');
    });

    // Gestion des projets
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);

    // Ajouter un membre à un projet
    Route::post(
        '/projects/{project}/members',
        [ProjectController::class, 'addMember']
    );

    // Route de test réservée à l'Admin
    Route::middleware('role:Admin')->get('/admin-test', function (Request $request) {
        return response()->json([
            'message' => 'Accès autorisé.',
            'user' => $request->user()->load('role'),
        ]);
    });
// route pour task project
    Route::get('/tasks', [TaskController::class, 'index']);
    Route::post('/tasks', [TaskController::class, 'store']);
     //pour moodifier le status d'une tache
    Route::patch('/tasks/{task}', [TaskController::class, 'updateStatus']);
    // Gestion des commentaires
    Route::get('/tasks/{task}/comments', [CommentController::class, 'index']);
    Route::post('/tasks/{task}/comments', [CommentController::class, 'store']);
    // Gestion des notifications
    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::patch('/notifications/{notification}/read', [
     NotificationController::class,
    'markAsRead',
]);
     // Dashboard et statistiques
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);

Route::put('/projects/{project}', [ProjectController::class, 'update']);
Route::patch('/projects/{project}', [ProjectController::class, 'update']);

Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

Route::post('/projects/{project}/members', [ProjectController::class, 'addMember']);
Route::delete(
    '/projects/{project}/members/{userId}',
    [ProjectController::class, 'removeMember']
);
// Un membre quitte le projet
Route::delete(
    '/projects/{project}/leave',
    [ProjectController::class, 'leaveProject']
);
Route::get(
    '/projects/{project}/available-members',
    [ProjectController::class, 'availableMembers']
);

Route::patch('/notifications/read-all', [
    NotificationController::class,
    'markAllAsRead',
]);

// Gestion de l'équipe
Route::get('/team', [TeamController::class, 'index']);
Route::post('/team', [TeamController::class, 'store']);
// Modifier et supprimer un membre de l'équipe
Route::put('/team/{id}', [TeamController::class, 'update']);
Route::delete('/team/{id}', [TeamController::class, 'destroy']);

 });
