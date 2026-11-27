<?php
use Illuminate\Support\Facades\Route;
// React Landing Page
Route::get('/', function () {
    return response()->file(public_path('teamflow/index.html'));
});

// React Router: pages such as /login, /projects, /dashboard...
// Keep API, built assets and Laravel health check separate.
Route::get('/{path}', function () {
    return response()->file(public_path('teamflow/index.html'));
})->where(
    'path',
    '^(?!api(?:/|$)|teamflow(?:/|$)|up$).*$'
);
