<?php

namespace App\Http\Controllers;

use App\Enums\BankQuestionItemTypeEnum;
use App\Enums\BankQuestionTypeEnum;
use App\Exports\QuestionMultipleTrueChoicesTemplateExport;
use App\Exports\QuestionKepribadianTemplateExport;
use App\Exports\QuestionSingleTrueChoicesTemplateExport;
use App\Imports\QuestionMultiTrueChoicesImport;
use App\Imports\QuestionSingleTrueChoicesImport;
use App\Imports\QuestionKepribadianImport;
use App\Models\BankQuestion;
use App\Models\BankQuestionItem;
use App\Models\LearningCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Fluent;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Validator;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Excel as ExcelExcel;


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
    public function create(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $bank_question_id,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->findOrFail($bank_question_id);

        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );

        $view = null;
        switch ($bank_question->type) {
            case BankQuestionTypeEnum::Pilihan:
            case BankQuestionTypeEnum::Kepribadian:
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
                Rule::in(BankQuestionItemTypeEnum::casesString()),
            ],
            'answer' => 'required',
            'answer.type' => Rule::in(['Single', 'WeightedChoice']),
        ]);

        $validator->sometimes(
            'answers.choices',
            'array',
            fn (Fluent $item) => in_array(
                $item->type,
                [BankQuestionTypeEnum::Pilihan->name, BankQuestionTypeEnum::Kepribadian->name]
            ),
        );

        $isWeightedChoice = fn (Fluent $item) => $item->type == 'WeightedChoice';
        $validator->sometimes(
            'answer.answer',
            'required|array',
            $isWeightedChoice,
        );
        $validator->sometimes(
            'answer.answer.*.weight',
            'required|number|min:0',
            $isWeightedChoice,
        );

        $isSingleChoice = fn (Fluent $item) => $item->type == 'Single';
        $validator->sometimes(
            'answer.answer',
            'required|number',
            $isSingleChoice,
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
        $bank_question_id,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->findOrFail($bank_question_id);

        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );

        return \DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $bank_question_id,
        ) {
            $data = $this->validateData($request->all());

            $newQuestion = BankQuestionItem::create([
                'bank_question_id' => $bank_question_id,
                'name' => $data['name'],

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
                    $bank_question_id,
                ])
                ->banner('Question created successfully');
        });
    }

    public function storeMany(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $bank_question_id,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->findOrFail($bank_question_id);

        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );

        return \DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $bank_question_id,
        ) {
            $all = $request->validate([
                'type' => [
                    'required',
                    Rule::in(BankQuestionItemTypeEnum::casesString()),
                ],
                'name' => 'required|string',
                'stores' => 'required|array',
            ]);

            $questions = [];

            $clusterMax =
                (BankQuestionItem::select('cluster')
                    ->orderByDesc('cluster', 'desc')
                    ->lockForUpdate()
                    ->pluck('cluster')
                    ->first() ??
                    0) +
                1;

            foreach ($all['stores'] as $store) {
                $data = [
                    'name' => $all['name'],
                    'type' => $all['type'],
                    ...$store,
                ];

                $data = $this->validateData($data);

                $questions[] = BankQuestionItem::create([
                    'bank_question_id' => $bank_question_id,
                    'name' => $data['name'],

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
                    $bank_question_id,
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
        $bank_question_id,
        $id,
    ) {
        $item = BankQuestionItem::with(['learningCategory'])->findOrFail($id);

        Gate::authorize(
            'view',
            $item->learningCategory,
        );

        return Inertia::render('Admin/BankQuestion/Question/Show', [
            'item' => $item,
            'bank_question_id' => $bank_question_id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $bank_question,
        $id,
    ) {
        $item = BankQuestionItem::with(['learningCategory'])->findOrFail($id);

        Gate::authorize(
            'view',
            $item->learningCategory,
        );

        return Inertia::render('Admin/BankQuestion/Question/Edit', [
            'question' => $item,
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
        $bank_question,
        $id,
    ) {
        $item = BankQuestionItem::with(['learningCategory'])->findOrFail($id);

        Gate::authorize(
            'update',
            $item->learningCategory,
        );

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
                'name' => $data['name'],

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
    public function destroy(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $bank_question,
        $id,
    ) {
        $item = BankQuestionItem::with(['learningCategory'])->findOrFail($id);

        Gate::authorize(
            'update',
            $item->learningCategory,
        );

        return \DB::transaction(function () use (
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $bank_question,
            $id,
        ) {
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
                    $bank_question,
                ])
                ->banner('Question deleted successfully');
        });
    }

    public function restore(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $bank_question,
        $id,
    ) {
        $item = BankQuestionItem::with(['learningCategory'])->findOrFail($id);

        Gate::authorize(
            'update',
            $item->learningCategory,
        );
        return \DB::transaction(function () use (
            $learning_packet,
            $sub_learning_packet,
            $learning_category_id,
            $bank_question,
            $id,
        ) {
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
                    $bank_question,
                ])
                ->banner('Question restored successfully');
        });
    }

    public function import(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
        Request $request,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->find($id);

        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );

        $request->validate([
            'type' => ['required', 'in:WeightedChoice,Single'],
            'choice_count' => 'required|integer|min:2',
            'import_file' => 'required',
        ]);
        try {
            $import = null;
            switch ($request['type']) {
                case 'WeightedChoice':
                    $import = new QuestionMultiTrueChoicesImport($bank_question, $request['choice_count']);
                    break;
                case 'Single':
                    $import = new QuestionSingleTrueChoicesImport($bank_question , $request['choice_count']);
                    break;
            }
            Excel::import(
                $import,
                $request->file('import_file.file')->path('temp'),
                null,
                ExcelExcel::XLSX
            );
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $import_failures = $e->failures();
            $errors = array_map(function ($import_failure) {
                return [
                    'row' => $import_failure->row(),
                    'attribute' => $import_failure->attribute(),
                    'errors' => $import_failure->errors(),
                ];
            }, $import_failures);
            session()->flash('import_failures', $errors);
            return redirect()
                ->route('packet.sub.category.bank-question.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category_id,
                    $bank_question,
                ]);
            // $failures = $e->failures();
            // $errors = [];
            // foreach ($failures as $failure) {
            //     $errors[] = [
            //         'row' => $failure->row(),
            //         'attribute' => $failure->attribute(),
            //         'errors' => $failure->errors(),
            //     ];
            // }
            // return redirect()
            //     ->route('packet.sub.category.bank-question.show', [
            //         $learning_packet,
            //         $sub_learning_packet,
            //         $learning_category_id,
            //         $bank_question,
            //     ])
            //     ->with('errors', $errors);
        }

        activity()
            ->performedOn($bank_question)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'IMPORT'])
            ->log(
                'Question imported successfully with type ' . $request['type'],
            );

        return redirect()
            ->route('packet.sub.category.bank-question.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
                $bank_question,
            ])
            ->banner('Question imported successfully');
    }

    public function templateSingle(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
        Request $request,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->find($id);
        $choice_count = $request->validate([
            'choice_count' => 'required|integer|min:2',
        ])['choice_count'];
        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );
        $bank_question = BankQuestion::find($id);
        return Excel::download(
            new QuestionSingleTrueChoicesTemplateExport($bank_question, $choice_count),
            'Template Soal Pilihan Jawaban Tunggal.xlsx',
            ExcelExcel::XLSX
        );
    }

    public function templateMultiple(
        $learning_packet,
        $sub_learning_packet,
        $learning_category_id,
        $id,
        Request $request,
    ) {
        $bank_question = BankQuestion::with(['learningCategory'])->find($id);
        $choice_count = $request->validate([
            'choice_count' => 'required|integer|min:2',
        ])['choice_count'];
        Gate::authorize(
            'update',
            $bank_question->learningCategory,
        );

        return Excel::download(
            new QuestionMultipleTrueChoicesTemplateExport($bank_question, $choice_count),
            'Template Soal Pilihan Jawaban Ganda.xlsx',
            ExcelExcel::XLSX
        );
    }
}
