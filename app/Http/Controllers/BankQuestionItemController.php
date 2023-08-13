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
    public function create($learning_packet, $sub_learning_packet, $learning_category_id, BankQuestion $bank_question)
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
            'answer.type' => Rule::in(['Single', 'WeightedChoice']),
        ]);

        $validator->sometimes(
            'answers.choices',
            'array',
            fn (Fluent $item) => $item->type == BankQuestionTypeEnum::Pilihan->name,
        );

        $isWeightedChoice = fn (Fluent $item) => $item->type == 'WeightedChoice';
        $validator->sometimes('answer.answer', 'required|array', $isWeightedChoice);
        $validator->sometimes('answer.answer.*.weight', 'required|number', $isWeightedChoice);

        $isSingleChoice = fn (Fluent $item) => $item->type == 'Single';
        $validator->sometimes('answer.answer', 'required|number', $isSingleChoice);

        return $validator->validate();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question)
    {
        return \DB::transaction(function () use ($request, $learning_packet, $sub_learning_packet, $learning_category_id, $bank_question) {
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

            activity()
                ->performedOn($newQuestion)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'CREATE'])
                ->log('Question ' . $newQuestion->name . ' created successfully');

            return redirect()
                ->route('packet.sub.category.bank-question.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question
                ])
                ->banner('Question created successfully');
        });
    }

    public function storeMany(Request $request, $learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question)
    {
        return \DB::transaction(function () use ($request, $learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question) {
            $all = $request->validate([
                'type' => ['required', Rule::in(BankQuestionItemTypeEnum::casesString())],
                'name' => 'required|string',
                'weight' => 'required|numeric',
                'stores' => 'required|array',
            ]);

            $questions = [];

            $clusterMax = (BankQuestionItem::lockForUpdate()->max("cluster") ?? 0) + 1;

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
                    'cluster' => $clusterMax,

                    'answer' => $data['answer'],
                    'answers' => $data['answers'],
                ]);
            }

            activity()
                ->performedOn($questions[0])
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'CREATE'])
                ->log('Multiple Question Items created successfully');

            return redirect()
                ->route('packet.sub.category.bank-question.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question
                ])->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id)
    {
        return Inertia::render('Admin/BankQuestion/Question/Show', [
            'item' => fn () => BankQuestionItem::find($id),
            'bank_question_id' => $bank_question,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id)
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
    public function update(Request $request, $learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id)
    {
        return \DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $bank_question,
            $id,
        ) {
            $data = $this->validateData($request->all());

            $question = BankQuestionItem::find($id);
            $question->update([
                'weight' => $data['weight'],

                'type' => $data['type'],
                'question' => $data['question'],

                'answer' => $data['answer'],
                'answers' => $data['answers'],

                'explanation' => $data['explanation'],

            ]);

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'UPDATE'])
                ->log('Question ' . $question->name . ' updated successfully');

            return redirect()
                ->route('packet.sub.category.bank-question.item.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question,
                    $id,
                ])
                ->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id)
    {
        return \DB::transaction(function () use ($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id) {
            $question = BankQuestionItem::find($id);
            $question->update([
                'is_active' => false,
            ]);

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'DELETE'])
                ->log('Question ' . $question->name . ' deleted successfully');

            return redirect()
                ->route('packet.sub.category.bank-question.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question
                ])
                ->banner('Question deleted successfully');
        });
    }

    public function restore($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id)
    {
        return \DB::transaction(function () use ($learning_packet, $sub_learning_packet, $learning_category_id,  $bank_question, $id) {
            $question = BankQuestionItem::find($id);
            $question->update([
                'is_active' => true,
            ]);

            activity()
                ->performedOn($question)
                ->causedBy(auth()->user())
                ->withProperties(['method' => 'RESTORE'])
                ->log('Question ' . $question->name . ' restored successfully');

            return redirect()
                ->route('packet.sub.category.bank-question.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question
                ])
                ->banner('Question restored successfully');
        });
    }
}
