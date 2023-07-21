<?php

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
        Schema::dropIfExists("exam_answers");
        Schema::dropIfExists("exams");
        Schema::dropIfExists("question_images");
        Schema::dropIfExists("questions");
        Schema::dropIfExists("exercise_questions");
        Schema::create('exercise_questions', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("type");
            $table->decimal("time_limit");
            $table->unsignedINteger("number_of_question");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_questions');
    }
};
