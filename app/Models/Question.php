<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $casts = [
        'answers' => 'json',
    ];
    protected $fillable = ['content', 'answers', 'type', 'weight', 'time_limit', 'exercise_question_id', 'answer'];
}
