<?php

namespace App\Models;

use App\Enums\ExerciseQuestionTypeEnum;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExerciseQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Cachable;

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

    public function learningCategory(): BelongsTo
    {
        return $this->belongsTo(LearningCategory::class);
    }
}
