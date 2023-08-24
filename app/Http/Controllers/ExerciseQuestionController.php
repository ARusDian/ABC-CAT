<?php

namespace App\Http\Controllers;

use App\Enums\ExerciseQuestionTypeEnum;
use App\Exports\ExamResultExport;
use App\Models\BankQuestion;
use App\Models\DocumentFile;
use App\Models\Exam;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
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
            'exercise_questions' => fn () => ExerciseQuestion::all(),
        ]);
    }

    public function validateData($data)
    {
        return Validator::make($data, [
            'name' => 'required|string',
            'type' => [
                'required',
                Rule::in(ExerciseQuestionTypeEnum::casesString()),
            ],
            'time_limit' => 'required|numeric',
            'number_of_question' => 'required|numeric',
            'bank_question_items' => 'array',
            'bank_question_items.*' => 'numeric',
        ])->validate();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
    ) {
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
        $data = $this->validateData($request->all());

        $exercise = ExerciseQuestion::create([
            'name' => $data['name'],
            'type' => $data['type'],
            'time_limit' => $data['time_limit'],
            'options' => [
                'time_limit_per_cluster' => $data['type'] == ExerciseQuestionTypeEnum::Kecermatan->name,
                'number_of_question_per_cluster' => $data['type'] == ExerciseQuestionTypeEnum::Kecermatan->name,
                'next_question_after_answer' => $data['type'] == ExerciseQuestionTypeEnum::Kecermatan->name,
                'cluster_by_bank_question' => $data['type'] != ExerciseQuestionTypeEnum::Kecermatan->name,
            ],
            'number_of_question' => $data['number_of_question'],
            'learning_category_id' => $learning_category_id,
        ]);

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
        $exercise_question = ExerciseQuestion::whereType(
            $bank_question->type->name,
        )->get();

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
        return Inertia::render('Admin/ExerciseQuestion/Show', [
            'exercise_question' => fn () => ExerciseQuestion::with(['questions' => fn ($q) => $q->orderBy('id', 'asc')])
                ->withTrashed()
                ->findOrFail($id),
        ]);
    }

    public function leaderboard(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
    ) {
        return Inertia::render('Admin/ExerciseQuestion/Exam/Leaderboard', [
            'exercise_question' => fn () => ExerciseQuestion::with([
                'exams' => fn ($q) => $q->withScore(),
                'exams.user',
            ])
                ->withTrashed()
                ->findOrFail($id),
        ]);
    }


    public function ExamIndex($learning_packet, $sub_learning_packet, $learning_category_id, $id, Request $request)
    {
        $exams = Exam::withScore()
            ->with('user')
            ->ofFinished(true)
            ->ofExercise($id)
            ->whereColumns($request->get('columnFilters'))
            ->orderBy('finished_at', 'desc')
            ->get();
        return Inertia::render('Admin/ExerciseQuestion/Exam/Index', [
            'exercise_question' => fn () => ExerciseQuestion::findOrFail($id),
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
        $exam = Exam::withScore()->find($exam_id)->load('answers.question');
        return Inertia::render('Admin/ExerciseQuestion/Exam/Show', [
            'exercise_question' => fn () => ExerciseQuestion::with([
                'exams' => fn ($q) => $q->withScore(),
                'exams.user',
            ])
                ->withTrashed()
                ->findOrFail($id),
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
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])->withScore()->ofFinished(true)->find($exam_id);
        return Inertia::render('Admin/ExerciseQuestion/Exam/Result', [
            'exam' => $exam,
        ]);
    }

    public function getLeaderboardData($id)
    {
        $exercise_question = ExerciseQuestion::with([
            'exams' => fn ($q) => $q->withScore(),
            'exams.user',
        ])
            ->withTrashed()
            ->findOrFail($id);

        return response()->json($exercise_question);
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
        return Inertia::render('Admin/ExerciseQuestion/Edit', [
            'exercise_question' => fn () => ExerciseQuestion::withTrashed()->findOrFail(
                $id,
            ),
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
        $data = $this->validateData($request->all());

        $exercise = ExerciseQuestion::withTrashed()->findOrFail($id);
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

        $exercise_question = ExerciseQuestion::withTrashed()->findOrFail($id);

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
        //

        $exercise = ExerciseQuestion::findOrFail($id);
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
        $exercise = ExerciseQuestion::withTrashed()->findOrFail($id);
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
        $exams = Exam::where('exercise_question_id', $id)->with([
            'exerciseQuestion' => fn ($q) => $q->select('id', 'name', 'learning_category_id')->with([
                'learningCategory' => fn ($q) => $q->select('id', 'name', 'sub_learning_packet_id')->with([
                    'subLearningPacket' => fn ($q) => $q->select('id', 'name', 'learning_packet_id')->with([
                        'learningPacket' => fn ($q) => $q->select('id', 'name')
                    ])
                ])
            ]),
            'user' => fn ($q) => $q->select('id', 'name', 'email'),
        ])->withScore()->ofFinished(true)->get();

        activity()
            ->performedOn($exams->first()->exerciseQuestion)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'EXPORT'])
            ->log(
                'Exercise Question ' .
                    $exams->first()->exerciseQuestion->name .
                    ' exported successfully.',
            );

        return Excel::download(new ExamResultExport($exams, "Hasil Ujian " . $exams->first()->exerciseQuestion->name), 'Exam Result.xlsx');
    }
}
