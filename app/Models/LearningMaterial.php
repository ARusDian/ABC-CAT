<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterial extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description'];

    public function documents()
    {
        return $this->hasMany(LearningMaterialDocument::class);
    }
}
