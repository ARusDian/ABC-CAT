<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserLearningPacket extends Model
{
    use HasFactory;
    use Cachable;

    protected $fillable = [
        'user_id',
        'learning_packet_id',
        'subscription_date',
    ];


    protected $casts = [
        'subscription_date' => 'date'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function learningPacket()
    {
        return $this->belongsTo(LearningPacket::class);
    }
}
