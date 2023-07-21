<?php

namespace App\Http\Controllers;

use App\Enums\ExerciseQuestionTypeEnum;
use App\Models\BankQuestion;
use App\Models\DocumentFile;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
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
                Rule::in(ExerciseQuestionTypeEnum::casesString())
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
    public function create()
    {
        return Inertia::render('Admin/ExerciseQuestion/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $this->validateData($request->all());

        $exercise = ExerciseQuestion::create($data);

        $exercise->questions()->syncWithoutDetaching($data['bank_question_items']);

        return redirect()
            ->route('exercise-question.show', [$exercise->id])
            ->banner('Soal Latihan berhasil dibuat');
    }

    public function importFromBank($id)
    {
        $bank_question = BankQuestion::with(['items'])->findOrFail($id);
        $exercise_question = ExerciseQuestion::whereType($bank_question->type->name)->get();

        return Inertia::render('Admin/ExerciseQuestion/Import', [
            'bank_question' => $bank_question,
            'exercise_questions' => $exercise_question,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('Admin/ExerciseQuestion/Show', [
            'exercise_question' => fn () => ExerciseQuestion::with([
                'questions',
            ])->findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('Admin/ExerciseQuestion/Edit', [
            'exercise_question' => fn () => ExerciseQuestion::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $this->validateData($request->all());

        $exercise = ExerciseQuestion::findOrFail($id);
        $exercise->update($data);

        return redirect()
            ->route('exercise-question.show', [$id])
            ->banner('Soal Lathian berhasil diedit');
    }

    public function importUpdate(Request $request, string $id)
    {
        $data = $request->validate([
            'bank_question_items' => 'required|array',
            'bank_question_items.*' => 'numeric',
        ]);

        $exercise_question = ExerciseQuestion::findOrFail($id);

        $exercise_question->questions()->sync($data['bank_question_items'] ?? []);

        return redirect()
            ->route('exercise-question.show', [$exercise_question->id])
            ->banner('Soal Latihan berhasil dibuat');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
