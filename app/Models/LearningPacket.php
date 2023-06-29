<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningPacket extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'main_learning_packet_id',
    ];

    public function mainLearningPacket()
    {
        return $this->belongsTo(MainLearningPacket::class);
    }

    public function subLearningPackets()
    {
        return $this->hasMany(SubLearningPacket::class);
    }
}
