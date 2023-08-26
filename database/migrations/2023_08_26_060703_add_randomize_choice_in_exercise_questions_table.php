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
                $exercise->update([
                    'options' => [
                        ...(array)$exercise->options,

                        ...($exercise->type == ExerciseQuestionTypeEnum::Kecermatan ? [
                            // cluster prefix will only be used if cluster_by_bank_question is false
                            'randomize_choice' => true
                        ] : [
                            'randomize_choice' => false
                        ]),
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
