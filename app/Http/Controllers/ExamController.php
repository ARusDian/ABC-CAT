<?php

namespace App\Http\Controllers;

use App\Enums\BankQuestionItemTypeEnum;
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
        return Exam::with(['answers.question', 'exerciseQuestion' => function ($query) {
            $query->select('id', 'name');
        }])
            ->ofExercise($exercise_id)
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->first();
    }

    public function checkFinished(Exam $exam)
    {
        if ($exam->isExpired() && !$exam->finished) {
            $exam->finished_at = $exam->expired_in->minimum();
            $exam->save();
        }
    }

    public function calculateScore(ExamAnswer $exam): float
    {
        switch ($exam->question->type) {
            case BankQuestionItemTypeEnum::Pilihan:
            case BankQuestionItemTypeEnum::Kecermatan:
                $answer = $exam->question->answer;
                switch ($answer['type']) {
                    case 'Single':
                        if ($exam->answer == $answer['answer']) {
                            return 1;
                        } else {
                            return 0;
                        }
                        break;
                    case 'WeightedChoice':
                        return $answer['weight'][$exam->answer]['weight'] ?? 0;
                        break;
                };
                break;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($exercise_id)
    {
        $exam = $this->getInProgressExam($exercise_id);

        if ($exam != null) {
            $this->checkFinished($exam);

            if (!$exam->finished) {

                $exam->answers->each(
                    function ($answer) {
                        $answer->setHidden(['score']);
                        $answer->question->setHidden(['answer']);
                    }
                );

                return Inertia::render('Student/Exam/Run', [
                    'exam' => $exam,
                ]);
            }
        }


        $exercise = ExerciseQuestion::findOrFail($exercise_id);

        return Inertia::render('Student/Exam/Show', [
            'exercise_question' => $exercise,
            'exams' => Exam::withScore()->ofUser(auth()->id())->get()
        ]);
    }

    public function showAttempt($exercise_question, Exam $exam)
    {
        if (!$exam->finished) {
            return abort(404);
        }

        return Inertia::render('Student/Exam/ShowAttempt', [
            'exam' => $exam->load('answers.question'),
        ]);
    }

    public function finish($exercise_id)
    {
        $exam = Exam::ofExercise($exercise_id)
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->firstOrFail();

        $exam->update([
            'finished_at' => $exam->expire_in->minimum(),
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
                    'score' => 0,
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
                    ->with(['question'])
                    ->firstOrFail();

                $answer->state = $queue['state'] ?? null;
                $answer->answer = $queue['answer'] ?? null;
                $answer->score = $this->calculateScore($answer);

                $answer->save();
            }

            $this->checkFinished($exam);

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
