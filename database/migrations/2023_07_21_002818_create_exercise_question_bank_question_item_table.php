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
        Schema::create('exercise_question_bank_question_item', function (Blueprint $table) {
            $table->id();
            $table->foreignId("exercise_question_id")->constrained(null, 'id', 'exercise_question_id');
            $table->foreignId("bank_question_item_id")->constrained(null, 'id', 'bank_question_item_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exercise_question_bank_question_item');
    }
};
