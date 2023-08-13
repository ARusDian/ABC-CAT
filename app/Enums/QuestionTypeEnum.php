<?php

namespace App\Enums;

enum QuestionTypeEnum
{
    case Pilihan;
    case Kecermatan;

    public static function casesString()
    {
        return array_map(fn($q) => $q->name, self::cases());
    }
}
