<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningMaterial extends Model
{
    use HasFactory;
    use Cachable;

    protected $fillable = ['title', 'description', 'learning_category_id'];
    protected $casts = [
        'description' => 'json',
    ];

    public function documents()
    {
        return $this->hasMany(LearningMaterialDocument::class);
    }

    public function learningCategory(): BelongsTo
    {
        return $this->belongsTo(LearningCategory::class);
    }
}
