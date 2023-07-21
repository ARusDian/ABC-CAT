<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['exam_id', 'bank_question_item_id', 'answer', 'state'];

    protected $casts = [
        'answer' => 'json',
        'state' => 'json',
    ];

    public function question(): BelongsTo
    {
        return $this->belongsTo(BankQuestionItem::class, 'bank_question_item_id');
    }
}
