<?php

use App\Models\Exam;
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
        \DB::transaction(function () {
            $exams = Exam::with([
                'exerciseQuestion',
                'answers.question',
            ])->get();

            foreach ($exams as $exam) {
                $cluster_names = $exam->exerciseQuestion->cluster_names;
                $cluster = collect($cluster_names)->map(
                    fn($name, $key) => [
                        'counter' => $exam->counter[$key] ?? 0,
                        'name' => $name,
                    ],
                );
                $mapped_cluster_names = collect($cluster_names)->mapWithKeys(
                    fn($name, $key) => [$name => $key],
                );

                $cluster = $cluster->mapWithKeys(
                    fn($c) => [$mapped_cluster_names->get($c['name']) => $c],
                );
                $exam->update([
                    'cluster' => $cluster,
                ]);

                foreach ($exam->answers as $answer) {
                    $cluster =
                        $answer->question
                            ->{$exam->exerciseQuestion->cluster_by_column};
                    if ($cluster != $answer->cluster) {
                        $answer->update([
                            'cluster' => $cluster,
                        ]);
                    }
                }
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
