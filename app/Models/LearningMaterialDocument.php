<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Znck\Eloquent\Relations\BelongsToThrough;

class LearningMaterialDocument extends Model
{
    use HasFactory;
    use Cachable;
    use \Znck\Eloquent\Traits\BelongsToThrough;


    protected $fillable = [
        'caption',
        'learning_material_id',
        'document_file_id',
    ];

    public function learningPacket(): BelongsToThrough
    {
        return $this->belongsToThrough(LearningPacket::class, [LearningMaterial::class, SubLearningPacket::class]);
    }

    public function learningMaterial()
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function documentFile()
    {
        return $this->belongsTo(DocumentFile::class);
    }
}
