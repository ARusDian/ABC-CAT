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

    public function users()
    {
        return $this->belongsToMany(User::class, UserLearningPacket::class);
    }

    public function userLearningPackets()
    {
        return $this->hasMany(UserLearningPacket::class);
    }
}
