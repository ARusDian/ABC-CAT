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

    protected $casts = [
        'expire_in' => 'datetime'
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    public function scopeOfExercise($query, $exercise_question_id)
    {
        return $query->where('exercise_question_id', $exercise_question_id);
    }

    public function scopeOfUser($query, $user_id)
    {
        return $query->where("user_id", $user_id);
    }

    public function scopeOfFinished($query, bool $finished)
    {
        return $query->where("finished", $finished);
    }
}
