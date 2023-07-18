<?php

namespace App\Enums;

enum ExerciseQuestionTypeEnum
{
    case Pilihan;

        // only allow kecermatan in question type
    case Kecermatan;

    public static function casesString() {
        return array_map(fn ($q) => $q->name, Self::cases());
    }
}
