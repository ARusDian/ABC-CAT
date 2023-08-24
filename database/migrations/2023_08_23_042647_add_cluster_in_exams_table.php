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
            $table->json("cluster")->nullable();
        });

        $exams = Exam::with(['exerciseQuestion'])->get();

        foreach ($exams as $exam) {
            $cluster_names = $exam->exerciseQuestion->cluster_names;
            $exam->update([
                'options' => [
                    'exercise_question' => $exam->exerciseQuestion->options,
                ],
                'cluster' => collect($cluster_names)->map(fn ($name, $key) => ['counter' => $exam->counter[$key] ?? 0, 'name' => $name])
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exams', function (Blueprint $table) {
            $table->dropColumn("cluster");
        });
    }
};
