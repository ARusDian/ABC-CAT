<?php

namespace App\Models;

use App\Enums\BankQuestionItemTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankQuestionItem extends Model
{
    use HasFactory;

    protected $casts = [
        'answers' => 'json',
        'question' => 'json',
        'answer' => 'json',
        'explanation' => 'json',
        'type' => BankQuestionItemTypeEnum::class,
        'is_active' => 'boolean',
    ];

    protected $fillable = [
        'bank_question_id',
        'name',
        'weight',
        'time_limit',

        'type',
        'question',
        'explanation',

        'answer',
        'answers',

        'is_active',
    ];
}
