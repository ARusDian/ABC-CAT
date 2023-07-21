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
        Schema::create('bank_question_item_exercise_question', function (Blueprint $table) {
            $table->id();
            $table->foreignId("exercise_question_id")->constrained(null, 'id', 'exercise_question_id_bqieq');
            $table->foreignId("bank_question_item_id")->constrained(null, 'id', 'bank_question_item_id_bqieq');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_question_item_exercise_question');
    }
};
