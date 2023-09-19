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
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserLearningPacketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" eiddleware group. Now create something great!
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
    'exam',
])->group(function () {
    Route::get("/user/profile", [UserProfileController::class, "show"])->name("profile.show");

    Route::get("/dashboard", [DashboardController::class, "index"])->name("dashboard");

    Route::middleware(["role:student"])->name('student.')->group(function () {
        // Sub Paket Belajar
        Route::prefix("packet/{learning_packet}")->name('packet.')->group(function () {
            Route::get("", [SubLearningPacketController::class, "studentIndex"])->name("show");
            Route::prefix("/sub/{sub_learning_packet}/category/{learning_category}")->name('category.')->group(function () {
                // Materi Belajar
                Route::prefix("/material")->name('material.')->group(function () {
                    Route::get("", [LearningMaterialController::class, "studentIndex"])->name("index");
                    Route::get("{learning_material}", [LearningMaterialController::class, "studentShow"])->name("show");
                });
                // End Materi Belajar
                Route::get("/exercise", [ExamController::class, "index"])->name("exercise.index");
            });
        });
        // End Sub Paket Belajar

        // Exercise Question
        Route::prefix("exam")->as("exam.")->group(function () {

            Route::withoutMiddleware(['exam'])->group(function () {
                Route::get("{exercise_question}", [ExamController::class, "show"])->name("show");
                Route::put("{exercise_question}", [ExamController::class, "update"])->name("update");
                Route::post("{exercise_question}/finish", [ExamController::class, "finish"])->name("finish");
            });

            Route::post("{exercise_question}", [ExamController::class, "attempt"])->name("attempt");
            Route::get("{exercise_question}/leaderboard", [ExamController::class, "leaderboard"])->name("leaderboard");
            Route::get("{exercise_question}/attempt/{exam}", [ExamController::class, "showAttempt"])->name("show.attempt");
            Route::get("{exercise_question}/result/{exam}", [ExamController::class, "showResult"])->name("show.result");
        });
        // End Exercise Question
    });

    Route::middleware(["role:super-admin|instructor"])->withoutMiddleware(['exam'])->group(function () {
        Route::prefix("admin")->group(function () {
            Route::get("/guide-book", [DashboardController::class, "guide"])->name("guide");
            Route::get("/guide-book/download", [DashboardController::class, "guideDownload"])->name("guide.download");
            Route::middleware(["role:super-admin"])->group(function () {
                Route::resource("/user", UserController::class);
                Route::post('/user/{user}/restore', [UserController::class, "restore"])->name('user.restore');
                Route::delete('/user/{user}/force-delete', [UserController::class, "forceDelete"])->name('user.force-delete');
                Route::get('/user/{user}/export-result', [UserController::class, "exportExamResult"])->name('user.export-result');
                Route::get('/user/{user}/exam', [UserController::class, "exams"])->name('user.exam.index');
                Route::get('/user/{user}/exam/{exam}', [UserController::class, "examShow"])->name('user.exam.show');
                Route::get('/user/{user}/exam/{exam}/result', [UserController::class, "examResult"])->name('user.exam.result');
                Route::get('/user-ImEx', [UserController::class, "ImportExportView"])->name('ImEx');
                Route::post('/user-import', [UserController::class, "Import"])->name('user.import');
                Route::get('/user-export', [UserController::class, "Export"])->name('user.export');
                Route::get('/user-template', [UserController::class, "Template"])->name('user.import-template');
                Route::get('/user-activity', [UserActivityController::class, "Index"])->name('user-activity');

                Route::resource('/user-learning-packet', UserLearningPacketController::class);
                Route::get('/learning-packet-users/{learning_packet}', [UserLearningPacketController::class, "users"])->name('user-packet.users');
                Route::post('/user-learning-packet/{learning_packet}/store-many', [UserLearningPacketController::class, 'storeMany'])->name('user-learning-packet.store-many');
                Route::post('/user-learning-packet-import/{learning_packet}', [UserLearningPacketController::class, "Import"])->name('user-packet.import');
                Route::get('/user-learning-packet-export/{learning_packet}', [UserLearningPacketController::class, "Export"])->name('user-packet.export');
                Route::get('/user-learning-packet-template/{learning_packet}', [UserLearningPacketController::class, "Template"])->name('user-packet.import-template');

                Route::prefix("packet")->name("packet.")->group(function () {
                    Route::resource("", LearningPacketController::class)->parameter("", "learning_packet");
                    Route::post("{learning_packet}/restore", [LearningPacketController::class, "restore"])->name("restore");
                    // Sub Paket Belajar

                    Route::prefix("{learning_packet}/sub")->name("sub.")->group(function () {
                        Route::resource("", SubLearningPacketController::class)->parameter("", "sub_learning_packet");

                        // Kategori Belajar
                        Route::prefix("{sub_learning_packet}/category")->name("category.")->group(function () {
                            Route::resource("", LearningCategoryController::class)->parameter("", "learning_category");
                        });
                    });
                });
            });

            Route::resource("document-file", DocumentFileController::class);

            // Paket Belajar
            Route::middleware(['role:instructor'])->group((function(){
                Route::get("instructor-index", [LearningCategoryController::class, "instructorIndex"])->name("instructorIndex");
            }));
            Route::prefix("packet")->name("packet.")->group(function () {
                Route::get("", [LearningPacketController::class, "index"])->name("index");
                Route::get("{learning_packet}", [LearningPacketController::class, "show"])->name("show");
                // Sub Paket Belajar

                Route::prefix("{learning_packet}/sub")->name("sub.")->group(function () {
                    Route::get("{sub_learning_packet}", [SubLearningPacketController::class, "show"])->name("show");

                    // Kategori Belajar
                    Route::prefix("{sub_learning_packet}/category")->name("category.")->group(function () {
                        Route::get("{learning_category}", [LearningCategoryController::class, "show"])->name("show");
                        Route::prefix("{learning_category}/")->group(function () {

                            // Soal Latihan
                            Route::prefix("exercise")->name("exercise.")->group(function () {
                                Route::resource("", ExerciseQuestionController::class)->parameter("", "exercise_question");
                                Route::get("import/bank-question/{bank_question}", [ExerciseQuestionController::class, "importFromBank"])->name("import");
                                Route::prefix("{exercise_question}/")->group(function () {
                                    Route::post("restore", [ExerciseQuestionController::class, "restore"])->name("restore");
                                    Route::get("export", [ExerciseQuestionController::class, "export"])->name("export");
                                    Route::get("leaderboard", [ExerciseQuestionController::class, "leaderboard"])->name("leaderboard");
                                    Route::get("exam", [ExerciseQuestionController::class, "ExamIndex"])->name("exam");
                                    Route::get("exam/{exam_id}", [ExerciseQuestionController::class, "examShow"])->name("exam.show");
                                    Route::get("exam/{exam_id}/result", [ExerciseQuestionController::class, "examResult"])->name("exam.result");
                                    Route::put("import", [ExerciseQuestionController::class, "importUpdate"])->name("import.update");
                                    Route::resource("question", ExerciseQuestionQuestionController::class);
                                    Route::post("create-many", [ExerciseQuestionQuestionController::class, "storeMany"])->name("question.store-many");
                                    Route::post("question/{question}/restore", [ExerciseQuestionQuestionController::class, "restore"])->name("question.restore");
                                    Route::resource("exam-monitor", ExamMonitorController::class);
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
                                    Route::post("import", [BankQuestionItemController::class, "import"])->name("import");
                                    Route::get("template-single", [BankQuestionItemController::class, "templateSingle"])->name("template-single");
                                    Route::get("template-kepribadian", [BankQuestionItemController::class, "templateKepribadian"])->name("template-kepribadian");
                                    Route::get("template-multiple", [BankQuestionItemController::class, "templateMultiple"])->name("template-multiple");
                                    Route::post("item/{question}/restore", [BankQuestionItemCOntroller::class, "restore"])->name("item.restore");
                                    Route::post("create-many", [BankQuestionItemCOntroller::class, "storeMany"])->name("item.store-many");

                                    Route::post(
                                        "upload",
                                        [BankQuestionController::class, "uploadImage"]
                                    )->name("upload-image");
                                });
                            });
                            // End Bank Soal

                            // Materi Belajar
                            Route::resource("/material", LearningMaterialController::class);
                        });
                    });
                });
            });
        });
    });
});

Route::get("/file/{file}/file", [DocumentFileController::class, "showFile"]);
