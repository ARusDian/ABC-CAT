<?php

namespace App\Http\Controllers;

use App\Enums\BankQuestionItemTypeEnum;
use App\Enums\ExerciseQuestionTypeEnum;
use App\Models\Exam;
use App\Http\Controllers\Controller;
use App\Models\ExamAnswer;
use App\Models\ExerciseQuestion;
use App\Models\LearningCategory;
use Carbon\Carbon;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(
        $learning_packet,
        $sub_learning_packet,
        $learning_category,
    ) {
        //
        $learningCategory = LearningCategory::where(
            'id',
            $learning_category,
        )->firstOrFail();
        $exerciseQuestions = ExerciseQuestion::where(
            'learning_category_id',
            $learning_category,
        )
            ->orderBy('id', 'asc')
            ->get();
        return Inertia::render('Student/Exam/Index', [
            'learning_category' => $learningCategory,
            'exercise_questions' => $exerciseQuestions,
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

    public function getInProgressExam($exercise_id = null)
    {
        $query = Exam::disableCache()->with([
            'answers.question',
            'exerciseQuestion',
        ]);

        if ($exercise_id) {
            $query = $query->ofExercise($exercise_id);
        }

        return $query
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->first();
    }

    public function checkFinished(Exam $exam)
    {
        if ($exam->isExpired() && !$exam->finished) {
            $this->markFinished($exam);
        }
    }

    public function markFinished(Exam $exam)
    {
        $exam->finished_at = $exam->expire_in->minimum();

        $exam->markClusterChange($exam->finished_at);
        $exam->server_state = null;

        $exam->answers()->update([
            'state' => null,
            'server_state' => null,
        ]);
        $exam->save();
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
                        return $answer['answer'][$exam->answer]['weight'] ?? 0;
                        break;
                }
                break;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($exercise_id)
    {
        $exam = $this->getInProgressExam();

        if ($exam != null && $exam->exercise_question_id != $exercise_id) {
            return redirect()->route('student.exam.show', [
                $exam->exercise_question_id,
            ]);
        }

        if ($exam != null) {
            $this->checkFinished($exam);

            Gate::authorize('view', $exam);

            if (!$exam->finished) {
                $exam->answers->each(function ($answer) {
                    $answer->setHidden(['score']);
                    $answer->question->setHidden(['answer']);
                });

                return Inertia::render('Student/Exam/Run', [
                    'exam' => $exam,
                ]);
            }
        }

        $exercise = ExerciseQuestion::with(['learningPacket'])->findOrFail(
            $exercise_id,
        );
        Gate::authorize('view', $exercise->learningPacket);

        return Inertia::render('Student/Exam/Show', [
            'exercise_question' => $exercise,
            'exams' => Exam::withScore()
                ->ofExercise($exercise_id)
                ->ofUser(auth()->id())
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function showAttempt($exercise_question, $exam)
    {
        $exam = Exam::with(['answers.question'])->findOrFail($exam);

        Gate::authorize('view', $exam);
        return Inertia::render('Student/Exam/ShowAttempt', [
            'exam' => fn () => $exam,
        ]);
    }

    public function finish($exercise_id)
    {
        $exam = Exam::ofExercise($exercise_id)
            ->disableModelCaching()
            ->ofUser(auth()->id())
            ->ofFinished(false)
            ->firstOrFail();

        Gate::authorize('update', $exam);

        $this->markFinished($exam);
    }

    public function attempt($exercise_id)
    {
        return \DB::transaction(function () use ($exercise_id) {
            /**
             * @var \App\Models\ExerciseQuestion $exercise
             */
            $exercise = ExerciseQuestion::with([
                'questions',
                'learningPacket',
            ])->findOrFail($exercise_id);
            Gate::authorize('view', $exercise->learningPacket);

            if ($exercise->questions->count() == 0) {
                return redirect()
                    ->back()
                    ->dangerBanner(
                        'soal latihan ini tidak bisa dikerjakan sekarang, coba lagi nanti',
                    );
            }

            $cluster_question = $exercise->questions->groupBy(
                $exercise->cluster_by_column,
            );

            $expire_in = null;
            if ($exercise->options->time_limit_per_cluster) {
                $expire_in = Carbon::now()->addMinutes(
                    $exercise->time_limit * $cluster_question->keys()->count(),
                );
            } else {
                $expire_in = Carbon::now()->addMinutes($exercise->time_limit);
            }

            $selected_question_per_cluster = [];
            $cluster_column = $exercise->cluster_by_column;

            $pushQuestion = function (
                \App\Models\BankQuestionItem $question,
            ) use (&$selected_question_per_cluster, $cluster_column) {
                $selected_question_per_cluster[$question[$cluster_column]][] = $question;
            };

            if ($exercise->options->number_of_question_per_cluster) {
                foreach ($cluster_question->values()
                    as $cluster => $questions) {
                    foreach ($questions
                        ->lazy()
                        ->filter(fn ($q) => $q['is_active'])
                        ->shuffle()
                        ->take($exercise->number_of_question)
                        as $question) {
                        $pushQuestion($question);
                    }
                }
            } else {
                $per_cluster = intval(
                    floor(
                        $exercise->number_of_question /
                            $cluster_question->count(),
                    ),
                );

                foreach ($cluster_question as $cluster => $questions) {
                    foreach ($questions
                        ->lazy()
                        ->filter(fn ($q) => $q['is_active'])
                        ->shuffle()
                        ->take($per_cluster)
                        as $question) {
                        $pushQuestion($question);
                    }
                }

                // get id of question that is already selected to filter
                $selected_question_id = collect($selected_question_per_cluster)
                    ->flatten()
                    ->pluck('id');
                // question that is not selected before
                $not_selected_question = $exercise->questions->whereNotIn(
                    'id',
                    $selected_question_id,
                );
                // question that is needed to reach number_of_question
                $question_needed =
                    $exercise->number_of_question -
                    $selected_question_id->count();

                foreach ($not_selected_question
                    ->lazy()
                    ->shuffle()
                    ->take($question_needed)
                    as $question) {
                    $pushQuestion($question);
                }
            }

            $exam = Exam::create([
                'user_id' => auth()->id(),
                'exercise_question_id' => $exercise->id,
                'expire_in' => $expire_in,
                'server_state' => [
                    'last_change_cluster' => Carbon::now(),
                    'current_question' => null,
                    'current_exam_answer_id' => null,
                    'current_cluster' => array_key_first(
                        $selected_question_per_cluster,
                    ),
                ],
                'options' => [
                    'exercise_question' => $exercise->options,
                ],
                'cluster' => (object) collect($exercise->cluster_names)
                    ->map(fn ($name) => ['counter' => 0, 'name' => $name])
                    ->toArray(),
            ]);

            $question_number = 0;
            foreach ($selected_question_per_cluster
                as $cluster => $selected_question) {
                foreach ($selected_question as $question) {
                    ExamAnswer::create([
                        'exam_id' => $exam->id,
                        'bank_question_item_id' => $question->id,
                        'state' => null,
                        'answer' => null,
                        'score' => 0,
                        'cluster' => $cluster,
                        'server_state' => [
                            'question_number' => $question_number,
                        ],
                    ]);
                    $question_number += 1;
                }
            }

            return redirect()->route('student.exam.show', [$exercise->id]);
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
                'queue.*.change_question' => 'nullable',
                'queue.*.change_question.date' =>
                'required_with:queue.*.change_question|date',
                'queue.*.change_question.question' =>
                'required_with:queue.*.change_question|numeric',
                'queue.*.change_question.exam_answer_id' =>
                'required_with:queue.*.change_question|numeric',
                'queue.*.change_question.cluster' => 'numeric',

                'queue.*.change_answer' => 'nullable',
                'queue.*.change_answer.exam_answer_id' =>
                'required_with:queue.*.change_answer|numeric',
                'queue.*.change_answer.state' => 'nullable',
                'queue.*.change_answer.answer' => 'nullable',
                'queue.*.finish' => 'nullable',
            ]);

            /**
             * $var \App\Models\Exam
             */
            $exam = Exam::disableCache()
                ->with(['exerciseQuestion'])
                ->findOrFail($data['exam_id']);

            Gate::authorize('update', $exam);

            if ($exam->finished) {
                return [
                    'finished' => true,
                ];
            }

            /**
             * @var \Illuminate\Support\Collection<int,\App\Models\ExamAnswer>
             */
            $answer_cache = collect([]);

            $current_cluster = $exam->current_cluster;

            $getAnswer = fn ($answer_id): ExamAnswer => $answer_cache->getOrPut(
                $answer_id,
                fn () => ExamAnswer::disableCache()
                    ->where('id', $answer_id)
                    ->where('exam_id', $exam->id)
                    ->with(['question'])
                    ->firstOrFail(),
            );

            // idk why the data are not sorted by keys by default
            $queues = collect($data['queue'] ?? [])->sortKeys();
            $finish = false;
            foreach ($queues as $queue) {
                if ($q = $queue['change_answer'] ?? null) {
                    $answer_id = $q['exam_answer_id'];

                    $answer = $getAnswer($answer_id);

                    if ($exam->current_question == $answer->question_number) {
                        $answer->state = $q['state'] ?? null;
                        $answer->answer = $q['answer'] ?? null;
                        $answer->score = $this->calculateScore($answer);
                    }
                }

                if ($q = $queue['change_question'] ?? null) {
                    $q = $queue['change_question'];

                    $exam->setCurrentQuestion(
                        $getAnswer($q['exam_answer_id']),
                        Carbon::parse($q['date']),
                    );
                }

                if ($q = $queue['finish'] ?? null) {
                    $finish = true;
                }
            }


            foreach ($answer_cache as $answer) {
                $answer->save();
            }
            if ($finish) {
                $this->markFinished($exam);
            } else {
                $exam->save();
                $this->checkFinished($exam);
            }


            return [
                'finished' => $exam->finished,
                'cluster' => $exam->current_cluster,
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

    public function leaderboard($id)
    {
        return Inertia::render('Student/Exam/Leaderboard', [
            'exercise_question' => fn () => ExerciseQuestion::with([
                'exams' => fn ($q) => $q->withScore(),
                'exams.user',
            ])->findOrFail($id),
        ]);
    }

    public function showResult($exercise_question, $exam)
    {
        $exam = Exam::with([
            'answers.question',
            'exerciseQuestion.learningCategory',
        ])
            ->ofExercise($exercise_question)
            ->ofUser(auth()->id())
            ->findOrFail($exam)
            ->appendResult();

        Gate::authorize('view', $exam);

        return Inertia::render('Student/Exam/ShowResult', [
            'exam' => $exam,
            'user' => auth()->user(),
            // 'exam' => $exam->load('answers.question'),
        ]);
    }
}
