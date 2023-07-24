<?php

namespace App\Http\Controllers;

use App\Enums\ExerciseQuestionTypeEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Question;
use App\Models\BankQuestionItem;

use App\Models\QuestionImage;
use App\Http\Controllers\Controller;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Fluent;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Validator;

class ExerciseQuestionQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $questions = Question::all();
        return Inertia::render('Admin/Question/Index', [
            'questions' => $questions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ExerciseQuestion $exercise_question)
    {
        $view = null;
        switch ($exercise_question->type) {
            case ExerciseQuestionTypeEnum::Pilihan:
                $view = 'Admin/ExerciseQuestion/Question/Create';
                break;
            case ExerciseQuestionTypeEnum::Kecermatan:
                $view = 'Admin/ExerciseQuestion/Kecermatan/Create';
                break;
        }

        return Inertia::render($view, [
            'exercise_question' => $exercise_question,
        ]);
    }

    public function validateData($data)
    {
        $validator = Validator::make($data, [
            'question' => 'required',
            'explanation' => 'nullable',
            'answers' => 'required|array',
            'type' => [
                'required',
                Rule::in(
                    QuestionTypeEnum::casesString()
                ),
            ],
            'weight' => 'required|numeric',
            'answer' => 'required',
        ]);

        $validator->sometimes(
            'answers.choices',
            'array',
            fn (Fluent $item) => $item->type == QuestionTypeEnum::Pilihan->name,
        );

        return $validator->validate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $exercise_question)
    {
        return DB::transaction(function () use ($request, $exercise_question) {
            $data = $this->validateData($request->all());

            $submittedImagesId = [];

            $newQuestion = Question::create([
                'exercise_question_id' => $exercise_question,
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],
                'explanation' => $data['explanation'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            foreach ($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $newQuestion->id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()
                ->route('exercise-question.show', [$exercise_question])
                ->banner('Question created successfully');
        });
    }

    public function storeMany(Request $request, $exercise_question)
    {
        return \DB::transaction(function () use ($request, $exercise_question) {
            $all = $request->validate([
                'type' => ['required', Rule::in(QuestionTypeEnum::casesString())],
                'weight' => 'required|numeric',
                'stores' => 'required|array',
            ]);

            $questions = [];

            foreach ($all['stores'] as $store) {
                $data = [
                    'type' => $all['type'],
                    'weight' => $all['weight'],
                    ...$store
                ];

                $data = $this->validateData($data);

                $questions[] = Question::create([
                    'exercise_question_id' => $exercise_question,
                    'weight' => $data['weight'],

                    'type' => $data['type'],
                    'question' => $data['question'],
                    'explanation' => $data['explanation'] ?? [],

                    'answer' => $data['answer'],
                    'answers' => $data['answers'],
                ]);
            }

            return redirect()
                ->route('exercise-question.show', [$exercise_question])
                ->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($exercise_question, $id)
    {
        return Inertia::render('Admin/ExerciseQuestion/Question/Show', [
            'question' => fn () => BankQuestionItem::find($id),
            'exercise_question_id' => $exercise_question,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($exercise_question, $id)
    {
        //
        $question = Question::find($id);
        return Inertia::render('Admin/ExerciseQuestion/Question/Edit', [
            'question' => $question,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $exercise_question, $id)
    {
        return DB::transaction(function () use (
            $request,
            $exercise_question,
            $id,
        ) {
            $data = $this->validateData($request->all());

            $question = Question::find($id)->update([
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            return redirect()
                ->route('exercise-question.question.show', [
                    $exercise_question,
                    $id,
                ])
                ->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($exercise_question, $id)
    {
        return DB::transaction(function () use ($exercise_question, $id) {
            $question = Question::find($id);
            $question->update([
                'is_active' => false,
            ]);
            return redirect()
                ->route('exercise-question.show', [$exercise_question])
                ->banner('Question deleted successfully');
        });
    }

    public function restore($exercise_question, $id)
    {
        return DB::transaction(function () use ($exercise_question, $id) {
            $question = Question::find($id);
            $question->update([
                'is_active' => true,
            ]);
            return redirect()
                ->route('exercise-question.show', [$exercise_question])
                ->banner('Question restored successfully');
        });
    }
}
