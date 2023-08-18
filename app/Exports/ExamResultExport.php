<?php

namespace App\Exports;

use App\Models\ExerciseQuestion;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ExamResultExport implements FromView
{
    private $exercise_question;
    private $title;

    public function __construct(ExerciseQuestion $exercise_question, $title)
    {
        $this->exercise_question = $exercise_question;
        $this->title = $title;
    }

    public function view(): View
    {
        return view('exports.examResult', [
            'exercise_question' => $this->exercise_question,
            'title' => $this->title,
        ]);
    }
}
