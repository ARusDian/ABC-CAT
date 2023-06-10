<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Http\Controllers\Controller;
use App\Models\ExamAnswer;
use App\Models\ExerciseQuestion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show($exercise_id)
    {
        $exam = Exam::with(['answers.question'])->where('exercise_question_id', $exercise_id)->where('finished', false)->first();

        if ($exam != null) {

            return Inertia::render('Student/Exam/Run', [
                'exam' => $exam
            ]);
        } else {
            $exercise = ExerciseQuestion::find($exercise_id);

            return Inertia::render('Student/Exam/Show', [
                'exercise_question' => $exercise
            ]);
        }
    }

    public function finish($exercise_id)
    {
        $exam = Exam::where('exercise_question_id', $exercise_id)->where('finished', false)->firstOrFail();

        $exam->update([
            'finished' => true
        ]);
    }

    public function attempt($exercise)
    {
        return \DB::transaction(function () use ($exercise) {
            $exercise = ExerciseQuestion::with(['questions'])->findOrFail($exercise);
            $expire_in = Carbon::now()->addMinutes($exercise->time_limit);

            $exam = Exam::create([
                'user_id' => auth()->id(),
                'exercise_question_id' => $exercise->id,
                'expire_in' => $expire_in,
                'finished' => false,
            ]);

            foreach ($exercise->questions as $question) {
                ExamAnswer::create([
                    'exam_id' => $exam->id,
                    'question_id' => $question->id,
                    'state' => null,
                    'answer' => null
                ]);
            }


            return redirect()->route("exam.show", [$exercise->id]);
        });
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Exam $exam)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        //
    }
}
