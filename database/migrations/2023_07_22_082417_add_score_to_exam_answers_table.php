<?php

use App\Http\Controllers\ExamController;
use App\Models\ExamAnswer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('exam_answers', function (Blueprint $table) {
            $table->decimal('score');
        });

        $examController = new ExamController();
        $answers = ExamAnswer::with(['question'])->get();
        foreach ($answers as $answer) {
            $answer->score = $examController->calculateScore($answer);
            $answer->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_answers', function (Blueprint $table) {
            $table->dropColumn('score');
        });
    }
};
