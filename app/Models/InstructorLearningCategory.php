<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstructorLearningCategory extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'learning_category_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function learningCategory()
    {
        return $this->belongsTo(LearningCategory::class);
    }

    public function scopeOfUser($query, $id)
    {
        return $query->where('user_id', $id);
    }

    public function scopeOfCategory($query, $id)
    {
        return $query->where('learning_category_id', $id);
    }
}
