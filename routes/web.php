<?php

use App\Actions\Fortify\UserProfileController;
use App\Http\Controllers\BankQuestionController;
use App\Http\Controllers\BankQuestionItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentFileController;
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
    return redirect (route('login'));
});

route::get('/test', function () {
    return Inertia::render('Student/PROTOTYPEVIEW/ExamList');
})->name('test');

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
            Route::prefix('/exam')->as('exam.')->group(function () {
                Route::get('{exercise_question}', [ExamController::class, 'show'])->name('show');
                Route::put('{exercise_question}', [ExamController::class, 'update'])->name('update');
                Route::post('{exercise_question}', [ExamController::class, 'attempt'])->name("attempt");
                Route::post('{exercise_question}/finish', [ExamController::class, 'finish'])->name('finish');
            });
        });
    });
    Route::middleware(['role:admin|super-admin'])->group(function () {
        Route::prefix('admin')->group(function () {
            Route::prefix("exercise-question")->name("exercise-question.")->group(function () {
                Route::resource("", ExerciseQuestionController::class)->parameter("", "exercise_question");
                Route::get("import/bank-question/{bank_question}", [ExerciseQuestionController::class, 'importFromBank'])->name("import");
                Route::put("{exercise_question}/import", [ExerciseQuestionController::class, 'importUpdate'])->name("import.update");
                Route::prefix("{exercise_question}/")->group(function () {
                    Route::resource("question", BankQuestionItemController::class);
                    Route::post("create-many", [ExerciseQuestionQuestionController::class, 'storeMany'])->name("question.store-many");
                    Route::post("question/{question}/restore", [ExerciseQuestionQuestionController::class, 'restore'])->name('question.restore');

                    Route::post(
                        'upload',
                        [ExerciseQuestionController::class, 'uploadImage']
                    )->name('upload-image');
                });
            });

            Route::prefix("bank-question")->name("bank-question.")->group(function () {
                Route::resource("", BankQuestionController::class)->parameter("", "bank_question");
                Route::prefix("{bank_question}/")->group(function () {
                    Route::resource("item", BankQuestionItemController::class);
                    Route::get("create-question", [BankQuestionController::class, 'createPacketQuestion']);
                    Route::post("item/{question}/restore", [BankQuestionItemCOntroller::class, 'restore'])->name('item.restore');
                    Route::post("create-many", [BankQuestionItemCOntroller::class, 'storeMany'])->name("item.store-many");

                    Route::post(
                        'upload',
                        [ExerciseQuestionController::class, 'uploadImage']
                    )->name('upload-image');
                });
            });


            Route::resource('/learning-material', LearningMaterialController::class);
            Route::middleware(['role:super-admin'])->group(function () {
                Route::resource('/user', UserController::class);
            });
        });
    });
});

Route::get('/file/{file}/file', [DocumentFileController::class, 'showFile']);
