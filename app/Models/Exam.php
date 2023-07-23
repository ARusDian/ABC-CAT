<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
        'expire_in' => 'datetime',
        'finished_at' => 'datetime',
    ];

    protected $appends = [
        'finished'
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exerciseQuestion(): BelongsTo
    {
        return $this->belongsTo(ExerciseQuestion::class);
    }

    public function scopeOfExercise($query, $exercise_question_id)
    {
        return $query->where('exercise_question_id', $exercise_question_id);
    }

    public function scopeOfUser($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function scopeOfFinished($query, bool $finished)
    {
        if ($finished) {
            return $query->whereNotNull('finished_at');
        } else {
            return $query->whereNull('finished_at');
        }
    }

    public function isExpired(): bool
    {
        return $this->expire_in < Carbon::now();
    }

    public function finished(): Attribute
    {
        return Attribute::get(fn () => $this->finished_at != null);
    }
}
