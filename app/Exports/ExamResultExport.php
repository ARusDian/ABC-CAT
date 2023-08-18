<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ExamResultExport implements FromView
{
    private $exams;
    private $title;

    public function __construct(EloquentCollection $exams, $title)
    {
        $this->exams = $exams;
        $this->title = $title;
    }

    public function view(): View
    {
        return view('exports.examResult', [
            'exams' => $this->exams,
            'title' => $this->title,
        ]);
    }
}
