<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionImage;
use App\Http\Controllers\Controller;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($exercise_question)
    {
        return Inertia::render('Admin/ExerciseQuestion/Question/Create', [
            'exercise_question' => ExerciseQuestion::findOrFail($exercise_question)
        ]);
    }

    public function validateData($data)
    {
        return Validator::make($data, [
            'question' => 'required',
            'answers' => 'required|array',
            'type' => [
                'required',
                Rule::in(['pilihan']),
            ],
            'answer' => 'required',
        ])->validate();
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

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            foreach ($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $newQuestion->id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()->route('exercise-question.show', [$exercise_question])->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($exercise_question, $id)
    {
        return Inertia::render('Admin/ExerciseQuestion/Question/Show', [
            'question' => fn () => Question::find($id),
            'exercise_question_id' => $exercise_question,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $question = Question::find($id);
        return Inertia::render('Admin/ExerciseQuestion/Question/Edit', [
            'question' => $question
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $exercise_question, $id)
    {

        return DB::transaction(function () use ($request, $exercise_question, $id) {
            $data = $this->validateData($request->all());

            $question = Question::find($id)->update([
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            return redirect()->route('exercise-question.question.show', [$exercise_question, $id])->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $question = Question::find($id);
            $question->delete();
            return redirect()->route('question.index')->banner('Question deleted successfully');
        });
    }
}
