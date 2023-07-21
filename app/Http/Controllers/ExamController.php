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

    public function getInProgressExam($exercise_id)
    {
        return Exam::with(['answers.question'])
            ->ofExercise($exercise_id)
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->first();
    }

    /**
     * Display the specified resource.
     */
    public function show($exercise_id)
    {
        $exam = $this->getInProgressExam($exercise_id);

        if ($exam != null) {
            $exam->answers->each(
                fn ($answer) => $answer->question->setHidden(['answer']),
            );

            return Inertia::render('Student/Exam/Run', [
                'exam' => $exam,
            ]);
        } else {

            $exercise = ExerciseQuestion::findOrFail($exercise_id);

            return Inertia::render('Student/Exam/Show', [
                'exercise_question' => $exercise,
            ]);
        }
    }

    public function finish($exercise_id)
    {
        $exam = Exam::ofExercise($exercise_id)
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->firstOrFail();

        $exam->update([
            'finished' => true,
        ]);
    }

    public function attempt($exercise_id)
    {
        $exam = $this->getInProgressExam($exercise_id);

        if ($exam) {
            return redirect()->route("exam.show", [$exercise_id]);
        }
        return \DB::transaction(function () use ($exercise_id) {

            /**
             * @var \App\Models\ExerciseQuestion $exercise
             */
            $exercise = ExerciseQuestion::with(['questions'])->findOrFail(
                $exercise_id,
            );
            $expire_in = Carbon::now()->addMinutes($exercise->time_limit);

            $exam = Exam::create([
                'user_id' => auth()->id(),
                'exercise_question_id' => $exercise->id,
                'expire_in' => $expire_in,
                'finished' => false,
            ]);

            foreach ($exercise->questions
                    ->filter(fn ($q) => $q['is_active'])
                    ->shuffle()
                    ->take($exercise->number_of_question)
                as $question) {
                ExamAnswer::create([
                    'exam_id' => $exam->id,
                    'bank_question_item_id' => $question->id,
                    'state' => null,
                    'answer' => null,
                ]);
            }

            return redirect()->route('exam.show', [$exercise->id]);
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
    public function update(Request $request)
    {
        return \DB::transaction(function () use ($request) {
            $data = $request->validate([
                'exam_id' => 'numeric',
                'queue' => [
                    'exam_answer_id' => 'required',
                    'state' => 'nullable',
                    'answer' => 'nullable',
                ],
            ]);

            $exam = Exam::findOrFail($data['exam_id']);

            if ($exam->finished) {
                return [
                    'finished' => true,
                ];
            }

            foreach ($data['queue'] as $queue) {
                $answer = ExamAnswer::where('id', $queue['exam_answer_id'])
                    ->where('exam_id', $exam->id)
                    ->firstOrFail();

                $answer->state = $queue['state'] ?? null;
                $answer->answer = $queue['answer'] ?? null;

                $answer->save();
            }

            if ($exam->expire_in < Carbon::now()) {
                $exam->finished = true;
                $exam->save();
            }

            return [
                'finished' => $exam->finished,
            ];
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        //
    }
}
