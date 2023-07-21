<?php

namespace App\Models;

use App\Enums\BankQuestionTypeEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BankQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
    ];

    protected $casts = [
        'type' => BankQuestionTypeEnum::class
    ];

    public function items(): HasMany{
        return $this->hasMany(BankQuestionItem::class);
    }
}
