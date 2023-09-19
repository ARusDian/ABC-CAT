<?php

namespace App\Exports;

use App\Models\BankQuestion;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class QuestionSingleTrueChoicesTemplateExport implements FromView
{
    private $bankQuestion;
    private $choice_count;

    public function __construct(BankQuestion $bankQuestion, int $choice_count)
    {
        $this->bankQuestion = $bankQuestion;
        $this->choice_count = $choice_count;
    }

    public function view(): View
    {
        return view('templates.QuestionSingleTrueChoices', [
            'bankQuestion' => $this->bankQuestion,
            'choice_count' => $this->choice_count,
        ]);
    }
}
