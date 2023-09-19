<?php

namespace App\Http\Controllers;

use App\Enums\ExerciseQuestionTypeEnum;
use App\Enums\QuestionTypeEnum;
use App\Models\Question;
use App\Models\BankQuestionItem;
use App\Models\LearningCategory;
use App\Models\QuestionImage;
use App\Http\Controllers\Controller;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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
    public function create(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
    ) {
        $exercise_question = ExerciseQuestion::with(['learningCategory'])->findOrFail($exercise_question_id);
        Gate::authorize(
            'view',
            $exercise_question,
        );

        $view = null;
        switch ($exercise_question->type) {
            case ExerciseQuestionTypeEnum::Pilihan:
            case ExerciseQuestionTypeEnum::Kepribadian:
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
            'type' => ['required', Rule::in(QuestionTypeEnum::casesString())],
            'weight' => 'required|numeric',
            'answer' => 'required',
        ]);

        $validator->sometimes(
            'answers.choices',
            'array',
            fn (Fluent $item) => in_array($item->typ,[QuestionTypeEnum::Pilihan->name]),
        );

        return $validator->validate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
    ) {

        $exercise = ExerciseQuestion::with(['learningCategory'])->findOrFail($exercise_question_id);
        Gate::authorize(
            'update',
            $exercise->learningCategory,
        );

        return DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $exercise_question_id,
        ) {
            $data = $this->validateData($request->all());

            $submittedImagesId = [];

            $newQuestion = Question::create([
                'exercise_question_id' => $exercise_question_id,
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

            activity()
                ->performedOn($newQuestion)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'CREATE'])
                ->log(
                    'Question ' .
                        $newQuestion->question .
                        ' created successfully.',
                );

            return redirect()
                ->route('packet.sub.category.exercise.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $exercise_question_id,
                ])
                ->banner('Question created successfully');
        });
    }

    public function storeMany(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
    ) {
        $exercise = ExerciseQuestion::with(['learningCategory'])->findOrFail($exercise_question_id);
        Gate::authorize(
            'update',
            $exercise->learningCategory,
        );
        return \DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $exercise_question_id,
        ) {
            $all = $request->validate([
                'type' => [
                    'required',
                    Rule::in(QuestionTypeEnum::casesString()),
                ],
                'weight' => 'required|numeric',
                'stores' => 'required|array',
            ]);

            $questions = [];

            foreach ($all['stores'] as $store) {
                $data = [
                    'type' => $all['type'],
                    'weight' => $all['weight'],
                    ...$store,
                ];

                $data = $this->validateData($data);

                $questions[] = Question::create([
                    'exercise_question_id' => $exercise_question_id,
                    'weight' => $data['weight'],

                    'type' => $data['type'],
                    'question' => $data['question'],
                    'explanation' => $data['explanation'] ?? [],

                    'answer' => $data['answer'],
                    'answers' => $data['answers'],
                ]);
            }

            activity()
                ->performedOn($questions[0])
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'CREATE'])
                ->log('Question Items created successfully.');

            return redirect()
                ->route('packet.sub.category.exercise.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $exercise_question_id,
                ])
                ->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question_id,
        $id,
    ) {
        $question = BankQuestionItem::with(['learningCategory'])->findOrFail($id);
        Gate::authorize(
            'update',
            $question->learningCategory,
        );

        return Inertia::render('Admin/ExerciseQuestion/Question/Show', [
            'question' => $question,
            'exercise_question_id' => $exercise_question_id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question,
        $id,
    ) {
        $question = BankQuestionItem::with(['learningCategory'])->findOrFail($id);
        Gate::authorize(
            'update',
            $question->learningCategory,
        );
        return Inertia::render('Admin/ExerciseQuestion/Question/Edit', [
            'question' => $question,
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
        $exercise_question,
        $id,
    ) {
        $question = BankQuestionItem::with(['learningCategory'])->findOrFail($id);
        Gate::authorize(
            'update',
            $question->learningCategory,
        );

        return DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
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

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'UPDATE'])
                ->log(
                    'Question ' .
                        $question->question .
                        ' updated successfully.',
                );

            return redirect()
                ->route('packet.sub.category.exercise.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $exercise_question,
                ])
                ->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question,
        $id,
    ) {
        $question = BankQuestionItem::with(['learningCategory'])->findOrFail($id);
        Gate::authorize(
            'update',
            $question->learningCategory,
        );

        return DB::transaction(function () use ($exercise_question, $id) {
            $question = Question::find($id);
            $question->update([
                'is_active' => false,
            ]);

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'DELETE'])
                ->log(
                    'Question ' .
                        $question->question .
                        ' deleted successfully.',
                );

            return redirect()
                ->route('exercise.show', [$exercise_question])
                ->banner('Question deleted successfully');
        });
    }

    public function restore(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $exercise_question,
        $id,
    ) {
        $question = BankQuestionItem::with(['learningCategory'])->findOrFail($id);
        Gate::authorize(
            'update',
            $question->learningCategory,
        );

        return DB::transaction(function () use (
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $exercise_question,
            $id,
        ) {
            $question = Question::find($id);
            $question->update([
                'is_active' => true,
            ]);

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'RESTORE'])
                ->log(
                    'Question ' .
                        $question->question .
                        ' restored successfully.',
                );

            return redirect()
                ->route('packet.sub.category.exercise.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $exercise_question,
                ])
                ->banner('Question restored successfully');
        });
    }
}
