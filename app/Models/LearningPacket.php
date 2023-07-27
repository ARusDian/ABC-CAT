<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPacket extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function subLearningPackets()
    {
        return $this->hasMany(SubLearningPacket::class);
    }

    public function learningCategories()
    {
        return $this->hasManyThrough(LearningCategory::class, SubLearningPacket::class);
    }
}
