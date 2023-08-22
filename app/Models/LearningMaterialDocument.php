<?php

namespace App\Models;

use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterialDocument extends Model
{
    use HasFactory;
    use Cachable;

    protected $fillable = [
        'caption',
        'learning_material_id',
        'document_file_id',
    ];

    public function learningMaterial()
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function documentFile()
    {
        return $this->belongsTo(DocumentFile::class);
    }
}
