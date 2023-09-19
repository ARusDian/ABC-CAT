<?php

namespace App\Enums;

enum ExerciseQuestionTypeEnum
{
    case Pilihan;
    case Kepribadian;

    /**
     * only allow kecermatan in question type
     */
    case Kecermatan;

    public static function casesString()
    {
        return array_map(fn($q) => $q->name, self::cases());
    }
}
