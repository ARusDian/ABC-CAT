<?php

namespace App\Models;

use App\Enums\BankQuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExerciseQuestion extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'type', 'time_limit', 'number_of_question'];

    protected $casts = [
        'time_limit' => 'float',
        'type' => BankQuestionTypeEnum::class,
    ];

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(BankQuestionItem::class);
    }
}
