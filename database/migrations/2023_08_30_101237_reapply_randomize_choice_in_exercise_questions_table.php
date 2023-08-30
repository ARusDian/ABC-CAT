<?php

use App\Enums\ExerciseQuestionTypeEnum;
use App\Models\ExerciseQuestion;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $exercises = ExerciseQuestion::withTrashed()->get();

        foreach ($exercises as $exercise) {
            $isKecermatan = $exercise->type == ExerciseQuestionTypeEnum::Kecermatan;
            $exercise->update([
                'options' => [
                    ...(array)$exercise->options,
                    'randomize_choice' => true,
                    'number_of_question_per_cluster' => $isKecermatan,
                    'next_question_after_answer' => $isKecermatan,
                    'time_limit_per_cluster' => $isKecermatan,

                ]
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
