<?php

namespace App\Enums;

enum BankQuestionItemTypeEnum
{
    case Pilihan;
    case Kecermatan;

    public static function casesString() {
        return array_map(fn ($q) => $q->name, Self::cases());
    }
}
