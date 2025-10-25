<?php

namespace App\Http\Controllers;

use App\Enums\ExerciseQuestionTypeEnum;
use App\Exports\ExamResultExport;
use App\Models\BankQuestion;
use App\Models\LearningCategory;
use App\Models\Exam;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Validator;

class ExerciseQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/ExerciseQuestion/Index', [
            'exercise_questions' => fn() => ExerciseQuestion::all(),
        ]);
    }

    public function validateData($data, $learning_category_id)
    {
        $data = Validator::make($data, [
            'name' => 'required|string',
            'type' => [
                'required',
                Rule::in(ExerciseQuestionTypeEnum::casesString()),
            ],
            'time_limit' => 'required|numeric',
            'number_of_question' => 'required|numeric',
            'bank_question_items' => 'array',
            'bank_question_items.*' => 'numeric',
            'options.next_question_after_answer' => 'boolean',
        ])->validate();

        $isKecermatan =
            $data['type'] == ExerciseQuestionTypeEnum::Kecermatan->name;

        $is_continuous =
            $data['options']['next_question_after_answer'] ?? false;

        return [
            'name' => $data['name'],
            'type' => $data['type'],
            'time_limit' => $data['time_limit'],
            'options' => [
                'randomize_choice' => true,
                'time_limit_per_cluster' => $isKecermatan,
                'number_of_question_per_cluster' => $isKecermatan,
                'next_question_after_answer' => $is_continuous,

                ...$isKecermatan
                ? [
                    // cluster prefix will only be used if cluster_by_bank_question is false
                    'cluster_name_prefix' => 'Kolom',
                ]
                : [
                    'cluster_name_prefix' => null,
                ],

                'cluster_by_bank_question' => !$isKecermatan,
            ],
            'number_of_question' => $data['number_of_question'],
            'learning_category_id' => $learning_category_id,
            'bank_question_items' => $data['bank_question_items'] ?? [],
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
    ) {
        Gate::authorize(
            'update',
            LearningCategory::findOrFail($learning_category_id),
        );

        return Inertia::render('Admin/ExerciseQuestion/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
    ) {
        Gate::authorize(
            'update',
            LearningCategory::findOrFail($learning_category_id),
        );
        $data = $this->validateData($request->all(), $learning_category_id);

        $exercise = ExerciseQuestion::create($data);

        if (isset($data['bank_question_items'])) {
            $exercise
                ->questions()
                ->syncWithoutDetaching($data['bank_question_items']);
        }

        activity()
            ->performedOn($exercise)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log(
                'Exercise Question ' .
                $exercise->name .
                ' created successfully.',
            );

        return redirect()
            ->route('packet.sub.category.exercise.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
                $exercise->id,
            ])
            ->banner('Soal Latihan berhasil dibuat');
    }

    public function importFromBank(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $bank_question = BankQuestion::with([
            'items' => function ($q) {
                return $q->where('is_active', true);
            },
        ])->findOrFail($id);

        Gate::authorize('update', $bank_question->learningCategory);

        $exercise_question = ExerciseQuestion::whereType(
            $bank_question->type->name,
        )
            ->whereLearningCategoryId($bank_question->learning_category_id)
            ->get();

        return Inertia::render('Admin/ExerciseQuestion/Import', [
            'bank_question' => $bank_question,
            'exercise_questions' => $exercise_question,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $exerciseQuestion = ExerciseQuestion::with([
            'questions' => fn($q) => $q->orderBy('id', 'asc'),
        ])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('view', $exerciseQuestion->learningCategory);

        return Inertia::render('Admin/ExerciseQuestion/Show', [
            'exercise_question' => $exerciseQuestion,
        ]);
    }

    public function getLeaderboardProps($id)
    {
        $exerciseQuestion = ExerciseQuestion::withTrashed()
            ->findOrFail($id);

        Gate::authorize('view', $exerciseQuestion->learningCategory);

        $exams = Exam::where('exercise_question_id', $exerciseQuestion->id)
            ->with('user')
            ->withSum('answers', 'score')  // Ini akan otomatis create 'answers_sum_score'
            ->get();

        return ['exercise_question' => $exerciseQuestion, 'exams' => $exams];
    }

    public function getLeaderboardData($id)
    {
        $data = $this->getLeaderboardProps($id);

        return response()->json($data);
    }


    public function leaderboard(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $data = $this->getLeaderboardProps($id);
        return Inertia::render('Admin/ExerciseQuestion/Exam/Leaderboard', $data);
    }

    public function ExamIndex(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
        Request $request,
    ) {
        $exerciseQuestion = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('view', $exerciseQuestion->learningCategory);

        $exams = Exam::with('user')
            ->ofFinished(true)
            ->ofExercise($id)
            ->whereColumns($request->get('columnFilters'))
            ->orderBy('finished_at', 'desc')
            ->get();

        return Inertia::render('Admin/ExerciseQuestion/Exam/Index', [
            'exercise_question' => $exerciseQuestion,
            'exams' => $exams,
        ]);
    }

    public function examShow(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
        $exam_id,
    ) {
        $exam = Exam::with(['answers.question', 'learningCategory', 'user'])
            ->findOrFail($exam_id);

        Gate::authorize('view', $exam->learningCategory);

        return Inertia::render('Admin/ExerciseQuestion/Exam/Evaluation', [
            'exam' => $exam,
        ]);
    }

    public function examResult(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
        $exam_id,
    ) {
        $exam = Exam::with([
            'exerciseQuestion.learningCategory',
            'user' => fn($q) => $q->select('id', 'name', 'email'),
        ])
            ->ofFinished(true)
            ->find($exam_id)
            ->appendResult();

        Gate::authorize('view', $exam->exerciseQuestion->learningCategory);

        return Inertia::render('Admin/ExerciseQuestion/Exam/Result', [
            'exam' => $exam,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $exercise = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('update', $exercise->learningCategory);
        return Inertia::render('Admin/ExerciseQuestion/Edit', [
            'exercise_question' => $exercise,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        return \DB::transaction(function () use ($request, $learning_packet, $sub_learning_packet, $learning_category_id, $id, ) {
            $exercise = ExerciseQuestion::with(['learningCategory'])
                ->withTrashed()
                ->findOrFail($id);

            $data = $this->validateData(
                $request->all(),
                $exercise->learning_category_id,
            );

            Gate::authorize('update', $exercise->learningCategory);

            $exercise->update($data);

            activity()
                ->performedOn($exercise)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'UPDATE'])
                ->log(
                    'Exercise Question ' .
                    $exercise->name .
                    ' updated successfully.',
                );

            return redirect()
                ->route('packet.sub.category.exercise.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $id,
                ])
                ->banner('Soal Lathian berhasil diedit');
        });
    }

    public function importUpdate(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $data = $request->validate([
            'bank_question_items' => 'required|array',
            'bank_question_items.*' => 'numeric',
        ]);

        $exercise_question = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('update', $exercise_question->learningCategory);

        $exercise_question
            ->questions()
            ->syncWithoutDetaching($data['bank_question_items'] ?? []);

        activity()
            ->performedOn($exercise_question)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'UPDATE'])
            ->log(
                'Exercise Question imported' .
                $exercise_question->name .
                ' updated successfully.',
            );

        return redirect()
            ->route('packet.sub.category.exercise.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
                $id,
            ])
            ->banner('Soal Latihan berhasil dibuat');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $exercise = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('update', $exercise->learningCategory);

        $exercise->delete();

        activity()
            ->performedOn($exercise)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log(
                'Exercise Question ' .
                $exercise->name .
                ' deleted successfully.',
            );

        return redirect()
            ->route('packet.sub.category.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
            ])
            ->banner('Latihan Soal berhasil dihapus');
    }

    public function restore(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $exercise = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('update', $exercise->learningCategory);
        $exercise->restore();

        activity()
            ->performedOn($exercise)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'RESTORE'])
            ->log(
                'Exercise Question ' .
                $exercise->name .
                ' restored successfully.',
            );

        return redirect()
            ->route('packet.sub.category.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
            ])
            ->banner('Latihan Soal berhasil dikembalikan');
    }

    public function export(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        $exercise = ExerciseQuestion::with([])
            ->withTrashed()
            ->findOrFail($id);

        Gate::authorize('update', $exercise->learningCategory);

        $exams = Exam::where('exercise_question_id', $id)
            ->with([
                'exerciseQuestion' => fn($q) => $q
                    ->select('id', 'name', 'learning_category_id')
                    ->with([
                        'learningCategory' => fn($q) => $q
                            ->select('id', 'name', 'sub_learning_packet_id')
                            ->with([
                                'subLearningPacket' => fn($q) => $q
                                    ->select('id', 'name', 'learning_packet_id')
                                    ->with([
                                        'learningPacket' => fn(
                                            $q,
                                        ) => $q->select('id', 'name'),
                                    ]),
                            ]),
                    ]),
                'user' => fn($q) => $q->select('id', 'name', 'email'),
            ])
            ->ofFinished(true)
            ->get();

        activity()
            ->performedOn($exams->first()->exerciseQuestion)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'EXPORT'])
            ->log(
                'Exercise Question ' .
                $exams->first()->exerciseQuestion->name .
                ' exported successfully.',
            );

        return Excel::download(
            new ExamResultExport(
                $exams,
                'Hasil Ujian ' . $exams->first()->exerciseQuestion->name,
            ),
            'Exam Result.xlsx',
        );
    }
}
