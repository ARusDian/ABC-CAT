<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class questionImage extends Model
{
    use HasFactory;

    protected $fillable=[
        'question_id',
        'document_file_id'
    ];
}
