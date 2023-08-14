<?php

namespace App\Exports;

use App\Models\LearningPacket;
use App\Models\UserLearningPacket;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class UserPacketsExport implements FromView
{
    private $learningPacket;

    public function __construct(LearningPacket $learningPacket)
    {
        $this->learningPacket = $learningPacket;
    }

    public function view(): View
    {
        return view('exports.userPacket', [
            'learningPacket' => $this->learningPacket,
        ]);
    }
}
