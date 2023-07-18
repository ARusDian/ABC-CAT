<?php

namespace App\Models;

use App\Enums\ExerciseQuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExerciseQuestion extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'type', 'time_limit', 'number_of_question'];

    protected $casts = [
        'time_limit' => 'float',
        'type' => ExerciseQuestionTypeEnum::class,
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
