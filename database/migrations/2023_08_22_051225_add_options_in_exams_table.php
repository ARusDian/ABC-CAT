<?php

use App\Models\Exam;
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
        Schema::table('exams', function (Blueprint $table) {
            $table->json('options')->nullable();
        });

        $exams = Exam::with(['exerciseQuestion'])->all();

        foreach ($exams as $exam) {
            $exam->update([
                'options' => [
                    'exercise_question' => $exam->exerciseQuestion->options,
                    'cluster_names' => $exam->exerciseQuestion->cluster_names,
                ]
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn("options");
        });
    }
};
