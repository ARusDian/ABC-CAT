<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'learning_category_id'];
protected $casts = [
'description' => 'json',
];

    public function documents()
    {
        return $this->hasMany(LearningMaterialDocument::class);
    }
}
