<?php

use App\Actions\Fortify\UserProfileController;
use App\Http\Controllers\BankQuestionController;
use App\Http\Controllers\BankQuestionItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentFileController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExerciseQuestionController;
use App\Http\Controllers\ExerciseQuestionQuestionController;
use App\Http\Controllers\Instructor\ExamMonitorController;
use App\Http\Controllers\LearningCategoryController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\LearningPacketController;
use App\Http\Controllers\SubLearningPacketController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLearningPacketController;
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

Route::get("/", function () {
    return redirect(route("login"));
});

route::get("/test", function () {
    return Inertia::render("Student/PROTOTYPEVIEW/Kategori");
})->name("test");

// Route::get("/exam", function () {
//     return Inertia::render("Student/Exam/TemplateExam");
// })->name("exam");


Route::middleware([
    "auth:sanctum",
    config("jetstream.auth_session"),
    "verified",
])->group(function () {
    Route::get("/user/profile", [UserProfileController::class, "show"])->name("profile.show");
    Route::get("/dashboard", [DashboardController::class, "index"])->name("dashboard");
    Route::middleware(["role:student"])->name('student.')->group(function () {
        Route::prefix("student")->group(function () {
            // Sub Paket Belajar
            Route::prefix("learning_packet/{learning_packet}")->name('learning-packet.')->group(function () {
                Route::get("", [SubLearningPacketController::class, "studentIndex"])->name("show");
                Route::prefix("/sub-learning-packet/{sub_learning_packet}/learning-category{learning_category}/")->name('learning-category.')->group(function () {
                    Route::get("", [LearningCategoryController::class, "studentIndex"])->name("show");
                    Route::prefix("/learning-material")->name('learning-material.')->group(function () {
                        Route::get("", [LearningMaterialController::class, "studentIndex"])->name("index");
                        Route::get("{learning_material}", [LearningMaterialController::class, "studentShow"])->name("show");
                    });
                    // Route::prefix("/learning-material/{learning_material}/")->name('learning-material.')->group(function () {
                    //     Route::get("", [LearningMaterialController::class, "studentIndex"])->name("show");
                    // });
                });
            });

            // TODO: Move to above inside learning_packet prefix
            // Exercise Question
            Route::prefix("exam")->as("exam.")->group(function () {
                Route::get("{exercise_question}", [ExamController::class, "show"])->name("show");
                Route::put("{exercise_question}", [ExamController::class, "update"])->name("update");
                Route::post("{exercise_question}", [ExamController::class, "attempt"])->name("attempt");
                Route::post("{exercise_question}/finish", [ExamController::class, "finish"])->name("finish");
                Route::get("{exercise_question}/attempt/{exam}", [ExamController::class, "showAttempt"])->name("show.attempt");
            });
            // End Exercise Question
        });
    });

    Route::middleware(["role:admin|super-admin"])->group(function () {
        Route::prefix("admin")->group(function () {
            Route::middleware(["role:super-admin"])->group(function () {
                Route::resource("/user", UserController::class);
            });
            // Paket Belajar
            Route::prefix("learning-packet")->name("learning-packet.")->group(function () {
                Route::resource("", LearningPacketController::class)->parameter("", "learning_packet");
                // Sub Paket Belajar

                Route::prefix("{learning_packet}/sub-learning-packet")->name("sub-learning-packet.")->group(function () {
                    Route::resource("", SubLearningPacketController::class)->parameter("", "sub_learning_packet");

                    // Kategori Belajar
                    Route::prefix("{sub_learning_packet}/learning-category")->name("learning-category.")->group(function () {
                        Route::resource("", LearningCategoryController::class)->parameter("", "learning_category");

                        Route::prefix("{learning_category}/")->group(function () {

                            // Soal Latihan
                            Route::prefix("exercise-question")->name("exercise-question.")->group(function () {
                                Route::resource("", ExerciseQuestionController::class)->parameter("", "exercise_question");
                                Route::get("import/bank-question/{bank_question}", [ExerciseQuestionController::class, "importFromBank"])->name("import");
                                Route::prefix("{exercise_question}/")->group(function () {
                                    Route::get("leaderboard", [ExerciseQuestionController::class, "leaderboard"])->name("leaderboard");
                                    Route::put("import", [ExerciseQuestionController::class, "importUpdate"])->name("import.update");
                                    Route::resource("question", ExerciseQuestionQuestionController::class);
                                    Route::post("create-many", [ExerciseQuestionQuestionController::class, "storeMany"])->name("question.store-many");
                                    Route::post("question/{question}/restore", [ExerciseQuestionQuestionController::class, "restore"])->name("question.restore");

                                    Route::post(
                                        "upload",
                                        [BankQuestionController::class, "uploadImage"]
                                    )->name("upload-image");
                                });
                            });
                            // End Soal Latihan

                            // Bank Soal
                            Route::prefix("bank-question")->name("bank-question.")->group(function () {
                                Route::resource("", BankQuestionController::class)->parameter("", "bank_question");
                                Route::prefix("{bank_question}/")->group(function () {
                                    Route::resource("item", BankQuestionItemController::class);
                                    Route::get("create-question", [BankQuestionController::class, "createPacketQuestion"]);
                                    Route::post("item/{question}/restore", [BankQuestionItemCOntroller::class, "restore"])->name("item.restore");
                                    Route::post("create-many", [BankQuestionItemCOntroller::class, "storeMany"])->name("item.store-many");

                                    Route::post(
                                        "upload",
                                        [BankQuestionController::class, "uploadImage"]
                                    )->name("upload-image");
                                });
                            });
                            // End Bank Soal

                            Route::resource("exam-monitor", ExamMonitorController::class);

                            // Materi Belajar
                            Route::resource("/learning-material", LearningMaterialController::class);
                        });
                    });
                });
            });

            Route::resource('/user-learning-packet', UserLearningPacketController::class);
        });
    });
});

Route::get("/file/{file}/file", [DocumentFileController::class, "showFile"]);
