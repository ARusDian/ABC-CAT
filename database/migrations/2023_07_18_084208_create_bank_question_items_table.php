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
        Schema::create('bank_question_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId("bank_question_id")->constrained();
            $table->string("name");
            $table->string("type");
            $table->decimal("weight");
            $table->json("answers");
            $table->json("answer");
            $table->json('question');
            $table->json("explanation");
            $table->boolean("is_active")->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bank_question_items');
    }
};
