<?php

use App\Actions\Fortify\UserProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExerciseQuestionController;
use App\Http\Controllers\ExerciseQuestionQuestionController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/exam', function () {
//     return Inertia::render('Student/Exam/TemplateExam');
// })->name('exam');


Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/user/profile', [UserProfileController::class, 'show'])->name('profile.show');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::middleware(['role:student'])->group(function () {
        Route::prefix('student')->group(function () {
            Route::prefix('exam')->as('exam.')->group(function () {
                Route::get('{exercise_question}', [ExamController::class, 'show'])->name('show');
                Route::post('{exercise_question}', [ExamController::class, 'attempt'])->name("attempt");
                Route::post('{exercise_question}/finish', [ExamController::class, 'finish'])->name('finish');
            });
        });
    });
    Route::middleware(['role:admin|super-admin'])->group(function () {
        Route::prefix('admin')->group(function () {
            Route::resource("exercise-question", ExerciseQuestionController::class);
            Route::resource("exercise-question.question", ExerciseQuestionQuestionController::class);

            Route::resource('/learning-material', LearningMaterialController::class);
            Route::middleware(['role:super-admin'])->group(function () {
                Route::resource('/user', UserController::class);
            });
        });
    });
});
