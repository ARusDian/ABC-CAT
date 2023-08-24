<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class LearningPacket extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Cachable;
    use \Staudenmeir\EloquentHasManyDeep\HasRelationships;

    protected $fillable = ['name', 'description', 'photo_path'];

    public function subLearningPackets()
    {
        return $this->hasMany(SubLearningPacket::class);
    }

    public function learningCategories()
    {
        return $this->hasManyThrough(
            LearningCategory::class,
            SubLearningPacket::class,
        );
    }

    public function users()
    {
        return $this->belongsToMany(User::class, UserLearningPacket::class);
    }

    public function userLearningPackets()
    {
        return $this->hasMany(UserLearningPacket::class);
    }

    public function bankQuestions()
    {
        return $this->hasManyDeep(BankQuestion::class, [SubLearningPacket::class, LearningCategory::class]);
    }

    public function bankQuestionItems()
    {
        return $this->hasManyDeep(BankQuestionItem::class, [SubLearningPacket::class, LearningCategory::class, BankQuestion::class]);
    }
}
