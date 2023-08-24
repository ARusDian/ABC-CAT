<?php

namespace App\Models;

use App\Enums\BankQuestionItemTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Znck\Eloquent\Relations\BelongsToThrough;

class BankQuestionItem extends Model
{
    use HasFactory;
    use Cachable;
    use \Znck\Eloquent\Traits\BelongsToThrough;

    protected $casts = [
        'answers' => 'json',
        'question' => 'json',
        'answer' => 'json',
        'explanation' => 'json',
        'type' => BankQuestionItemTypeEnum::class,
        'is_active' => 'boolean',
    ];

    protected $fillable = [
        'bank_question_id',
        'name',
        'weight',
        'time_limit',

        'type',
        'question',
        'explanation',
        'cluster',

        'answer',
        'answers',

        'is_active',
    ];

    public function bankQuestion()
    {
        return $this->belongsTo(BankQuestion::class);
    }

    public function learningCategory(): BelongsToThrough
    {
        return $this->belongsToThrough(LearningCategory::class, [BankQuestion::class]);
    }
}
