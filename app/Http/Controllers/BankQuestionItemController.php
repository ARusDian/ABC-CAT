<?php

namespace App\Http\Controllers;

use App\Enums\BankQuestionItemTypeEnum;
use App\Enums\BankQuestionTypeEnum;
use App\Models\BankQuestion;
use App\Models\BankQuestionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Fluent;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Validator;

class BankQuestionItemController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $items = BankQuestionItem::all();
        return Inertia::render('Admin/Question/Index', [
            'items' => $items,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create(BankQuestion $bank_question)
    {
        $view = null;
        switch ($bank_question->type) {
            case BankQuestionTypeEnum::Pilihan:
                $view = 'Admin/BankQuestion/Question/Create';
                break;
            case BankQuestionTypeEnum::Kecermatan:
                $view = 'Admin/BankQuestion/Kecermatan/Create';
                break;
        }

        return Inertia::render($view, [
            'bank_question' => $bank_question,
        ]);
    }

    public function validateData($data)
    {
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'question' => 'required',
            'explanation' => 'nullable',
            'answers' => 'required|array',
            'type' => [
                'required',
                Rule::in(
                    BankQuestionItemTypeEnum::casesString()
                ),
            ],
            'weight' => 'required|numeric',
            'answer' => 'required',
        ]);

        $validator->sometimes(
            'answers.choices',
            'array',
            fn (Fluent $item) => $item->type == BankQuestionTypeEnum::Pilihan->name,
        );

        return $validator->validate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $bank_question)
    {
        return \DB::transaction(function () use ($request, $bank_question) {
            $data = $this->validateData($request->all());

            $newQuestion = BankQuestionItem::create([
                'bank_question_id' => $bank_question,
                'name' => $data['name'],
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],
                'explanation' => $data['explanation'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            return redirect()
                ->route('bank-question.show', [$bank_question])
                ->banner('Question created successfully');
        });
    }

    public function storeMany(Request $request, $bank_question)
    {
        return \DB::transaction(function () use ($request, $bank_question) {
            $all = $request->validate([
                'type' => ['required', Rule::in(BankQuestionItemTypeEnum::casesString())],
                'name' => 'required|string',
                'weight' => 'required|numeric',
                'stores' => 'required|array',
            ]);

            $questions = [];

            foreach ($all['stores'] as $store) {
                $data = [
                    'name' => $all['name'],
                    'type' => $all['type'],
                    'weight' => $all['weight'],
                    ...$store
                ];

                $data = $this->validateData($data);

                $questions[] = BankQuestionItem::create([
                    'bank_question_id' => $bank_question,
                    'name' => $data['name'],
                    'weight' => $data['weight'],

                    'type' => $data['type'],
                    'question' => $data['question'],
                    'explanation' => $data['explanation'] ?? [],

                    'answer' => $data['answer'],
                    'answers' => $data['answers'],
                ]);
            }

            return redirect()
                ->route('bank-question.show', [$bank_question])
                ->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($bank_question, $id)
    {
        return Inertia::render('Admin/BankQuestion/Question/Show', [
            'item' => fn () => BankQuestionItem::find($id),
            'bank_question_id' => $bank_question,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($bank_question, $id)
    {
        //
        $question = BankQuestionItem::find($id);
        return Inertia::render('Admin/BankQuestion/Question/Edit', [
            'question' => $question,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $bank_question, $id)
    {
        return \DB::transaction(function () use (
            $request,
            $bank_question,
            $id,
        ) {
            $data = $this->validateData($request->all());

            $question = BankQuestionItem::find($id)->update([
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],
            ]);

            return redirect()
                ->route('bank-question.question.show', [
                    $bank_question,
                    $id,
                ])
                ->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($bank_question, $id)
    {
        return \DB::transaction(function () use ($bank_question, $id) {
            $question = BankQuestionItem::find($id);
            $question->update([
                'is_active' => false,
            ]);
            return redirect()
                ->route('bank-question.show', [$bank_question])
                ->banner('Question deleted successfully');
        });
    }

    public function restore($bank_question, $id)
    {
        return \DB::transaction(function () use ($bank_question, $id) {
            $question = BankQuestionItem::find($id);
            $question->update([
                'is_active' => true,
            ]);
            return redirect()
                ->route('bank-question.show', [$bank_question])
                ->banner('Question restored successfully');
        });
    }
}
