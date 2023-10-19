<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'bank_question_item_id',
        'answer',
        'state',
        'server_state',
        'score',
        'cluster',
        'choice_order',
    ];

    protected $casts = [
        'score' => 'float',
        'answer' => 'json',
        'state' => 'object',
        'server_state' => 'object',
        'choice_order' => 'object',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(
            BankQuestionItem::class,
            'bank_question_item_id',
        );
    }

    public function questionNumber(): Attribute
    {
        return Attribute::get(fn() => $this->server_state->question_number);
    }
}
