<?php

namespace App\Exports;

use App\Models\LearningPacket;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class UserPacketsTemplateExport implements FromView
{
    private $learningPacket;

    public function __construct(LearningPacket $learningPacket)
    {
        $this->learningPacket = $learningPacket;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function view(): View
    {
        return view('templates.userPacket', [
            'learningPacket' => $this->learningPacket,
        ]);
    }
}
