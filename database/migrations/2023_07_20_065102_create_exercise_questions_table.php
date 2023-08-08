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
        Schema::create('exercise_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_category_id')->constrained('learning_categories');
            $table->string("name");
            $table->string("type");
            $table->decimal("time_limit");
            $table->unsignedINteger("number_of_question");
            $table->softDeletes();
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
