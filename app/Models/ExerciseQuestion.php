<?php

namespace App\Models;

use App\Enums\ExerciseQuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExerciseQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'time_limit',
        'number_of_question',
        'learning_category_id',
    ];

    protected $casts = [
        'time_limit' => 'float',
        'type' => ExerciseQuestionTypeEnum::class,
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
