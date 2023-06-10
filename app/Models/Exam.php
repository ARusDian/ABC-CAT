<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'exercise_question_id',
        'expire_in',
        'finished',
    ];

    public function answers(): HasMany {
        return $this->hasMany(ExamAnswer::class);
    }
}
