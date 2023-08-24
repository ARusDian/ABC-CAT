<?php

use App\Enums\ExerciseQuestionTypeEnum;
use App\Models\ExerciseQuestion;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exercise_questions', function (Blueprint $table) {
            $table->json('options')->nullable();
        });

        $exercise_questions = ExerciseQuestion::withTrashed()->get();

        foreach ($exercise_questions as $exercise) {
            $exercise->update([
                'options' => [
                    'time_limit_per_cluster' =>
                        $exercise->type == ExerciseQuestionTypeEnum::Kecermatan,
                    'next_question_after_answer' =>
                        $exercise->type == ExerciseQuestionTypeEnum::Kecermatan,
                    'number_of_question_per_cluster' =>
                        $exercise->type == ExerciseQuestionTypeEnum::Kecermatan,
                    'cluster_by_bank_question' =>
                        $exercise->type != ExerciseQuestionTypeEnum::Kecermatan,
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exercise_questions', function (Blueprint $table) {
            $table->dropColumn('options');
        });
    }
};
