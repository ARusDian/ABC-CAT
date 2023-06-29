<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExerciseQuestion extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'time_limit',
    ];

    protected $casts = [
        'time_limit' => 'float',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
