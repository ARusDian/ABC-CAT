<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MainLearningPacket extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    public function learningPackets()
    {
        return $this->hasMany(LearningPacket::class);
    }
}
