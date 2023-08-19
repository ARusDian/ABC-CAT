<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamMonitorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id
    ) {
        return Inertia::render('Instructor/ExamMonitor/Index', [
            'exercise_question' => ExerciseQuestion::with(
                [
                    'exams' =>  fn ($q) => $q->with('user')->orderBy('id', 'desc'),
                ]
            )->findOrFail($exercise_question_id),
            // 'exams' => Exam::with(['exerciseQuestion', 'user'])
            //     ->when(
            //         $exercise_question_id != null,
            //         fn($q) => $q->where(
            //             'exercise_question_id',
            //             $exercise_question_id,
            //         ),
            //     )
            //     ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
        $exam_monitor
    ) {
        // dd($exam_monitor, $request->path());
        return Inertia::render('Instructor/ExamMonitor/Show', [
            'exam' => fn () => Exam::with([
                'exerciseQuestion',
                'user',
                'answers.question',
            ])->findOrFail($exam_monitor),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
