<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningMaterialDescriptionImage extends Model
{
    use HasFactory;

    protected $fillable = ['learning_material_id', 'document_file_id'];

    public function learningMaterial()
    {
        return $this->belongsTo(LearningMaterial::class);
    }

    public function documentFile()
    {
        return $this->belongsTo(DocumentFile::class);
    }
}
