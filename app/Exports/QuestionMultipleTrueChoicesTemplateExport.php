<?php

namespace App\Exports;

use App\Models\BankQuestion;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class QuestionMultipleTrueChoicesTemplateExport implements FromView
{
    private $bankQuestion;

    public function __construct(BankQuestion $bankQuestion)
    {
        $this->bankQuestion = $bankQuestion;
    }

    public function view(): View
    {
        return view('templates.QuestionMultipleTrueChoices', [
            'bankQuestion' => $this->bankQuestion,
        ]);
    }
}
