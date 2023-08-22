<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningCategory extends Model
{
    use HasFactory;
    use Cachable;

    protected $fillable = ['name', 'sub_learning_packet_id'];

    public function SubLearningPacket()
    {
        return $this->belongsTo(SubLearningPacket::class);
    }

    public function learningPacket()
    {
        return $this->belongsToThrough(
            LearningPacket::class,
            SubLearningPacket::class,
        );
    }

    public function learningMaterials()
    {
        return $this->hasMany(LearningMaterial::class);
    }

    public function bankQuestions()
    {
        return $this->hasMany(BankQuestion::class);
    }

    public function exerciseQuestions()
    {
        return $this->hasMany(ExerciseQuestion::class);
    }
}
