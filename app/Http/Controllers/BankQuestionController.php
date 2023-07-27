<?php

namespace App\Http\Controllers;

use App\Enums\BankQuestionTypeEnum;
use App\Models\BankQuestion;
use App\Models\DocumentFile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Validator;

class BankQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/BankQuestion/Index', [
            'bank_questions' => fn () => BankQuestion::all(),
        ]);
    }


    public function validateData($data)
    {
        return Validator::make($data, [
            'name' => 'required|string',
            'type' => [
                'required',
                Rule::in(BankQuestionTypeEnum::casesString())
            ],
        ])->validate();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet, $sub_learning_packet, $id)
    {
        return Inertia::render('Admin/BankQuestion/Create', []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $learning_packet, $sub_learning_packet, $learning_category_id)
    {
        $data = $this->validateData($request->all());

        $bank = BankQuestion::create([
            'name' => $data['name'],
            'type' => $data['type'],
            'learning_category_id' => $learning_category_id,
        ]);


        return redirect()
            ->route('learning-packet.sub-learning-packet.learning-category.bank-question.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
                $bank->id
            ])
            ->banner('Bank Soal berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $sub_learning_packet, $learning_category_id, $id)
    {
        return Inertia::render('Admin/BankQuestion/Show', [
            'bank_question' => fn () => BankQuestion::with([
                'items',
            ])->findOrFail($id),
        ]);
    }

    public function importExerciseQuestion($bank_question)
    {
        return Inertia::render('Admin/BankQuestion/Import', [
            'bank_question' => BankQuestion::with(['items'])->findOrFail($bank_question)
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $sub_learning_packet, $learning_category_id, $id)
    {
        return Inertia::render('Admin/BankQuestion/Edit', [
            'bank_question' => fn () => BankQuestion::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $learning_packet, $sub_learning_packet, $learning_category_id, $id)
    {
        $data = $this->validateData($request->all());

        $bank = BankQuestion::findOrFail($id);
        $bank->update($data);

        return redirect()
            ->route('learning-packet.sub-learning-packet.learning-category.bank-question.show', [
                $learning_packet,
                $sub_learning_packet,
                $learning_category_id,
                $id
            ])
            ->banner('Bank Soal berhasil diedit');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $sub_learning_packet, $learning_category_id, $id)
    {
        //
    }

    public function uploadImage(Request $request, $bank_question)
    {
        $file = $request->file('file');

        return DocumentFile::createFile(
            'public',
            "bank-question/$bank_question",
            $file,
            auth()->id(),
        );
    }
    //
}
