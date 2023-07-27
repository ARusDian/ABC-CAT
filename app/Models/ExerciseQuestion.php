<?php

namespace App\Models;

use App\Enums\BankQuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExerciseQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'type',
        'time_limit',
        'number_of_question',
        'learning_category_id'
    ];

    protected $casts = [
        'time_limit' => 'float',
        'type' => BankQuestionTypeEnum::class,
    ];

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(BankQuestionItem::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }
}
