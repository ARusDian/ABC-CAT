<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\QuestionTypeEnum;

class Question extends Model
{
    use HasFactory;

    protected $casts = [
        'answers' => 'json',
        'question' => 'json',
        'answer' => 'json',
        'explanation' => 'json',
        'type' => QuestionTypeEnum::class,
    ];

    protected $fillable = [
        // 'content', 'answers', 'type', 'weight', 'time_limit', 'exercise_question_id', 'answer'
        'exercise_question_id',
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
