<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubLearningPacket extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'learning_packet_id',
    ];

    public function learningPacket()
    {
        return $this->belongsTo(LearningPacket::class);
    }

    public function learningCategories()
    {
        return $this->hasMany(LearningCategory::class);
    }
}
