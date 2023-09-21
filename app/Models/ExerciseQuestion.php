<?php

namespace App\Models;

use App\Enums\ExerciseQuestionTypeEnum;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use phpDocumentor\Reflection\Types\Self_;

class ExerciseQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;
    use Cachable;
    use \Znck\Eloquent\Traits\BelongsToThrough;

    protected $fillable = [
        'name',
        'type',
        'time_limit',
        'time_limit_per_cluster',
        'options',
        'number_of_question',
        'learning_category_id',
    ];

    protected $casts = [
        'time_limit' => 'float',
        'type' => ExerciseQuestionTypeEnum::class,
        'options' => 'object',
    ];

    // protected $appends = ['cluster_names'];

    public function questions(): BelongsToMany
    {
        return $this->belongsToMany(BankQuestionItem::class);
    }

    public function exams(): HasMany
    {
        return $this->hasMany(Exam::class);
    }

    public function learningCategory(): BelongsTo
    {
        return $this->belongsTo(LearningCategory::class);
    }

    public function learningPacket()
    {
        return $this->belongsToThrough(LearningPacket::class, [
            SubLearningPacket::class,
            LearningCategory::class,
        ]);
    }

    public function clusterByColumn(): Attribute
    {
        return Attribute::get(function () {
            if ($this->options->cluster_by_bank_question) {
                return 'bank_question_id';
            } else {
                return 'cluster';
            }
        });
    }

    public function clusterNames(): Attribute
    {
        return Attribute::get(function () {
            $cluster_ids = null;
            $cluster_column = $this->cluster_by_column;
            if ($this->relationLoaded('questions')) {
                $cluster_ids = $this->questions
                    ->pluck($cluster_column)
                    ->unique()
                    ->values();
            } else {
                $cluster_ids = $this->questions()
                    ->select($cluster_column)
                    ->distinct()
                    ->pluck($cluster_column)
                    ->values();
            }

            $cluster_names = null;
            if ($this->options->cluster_by_bank_question) {
                $bank_questions = BankQuestion::whereIn(
                    'id',
                    $cluster_ids,
                )->get();
                $cluster_names = $bank_questions->pluck('name', 'id')->all();
            } else {
                $cluster_names = $cluster_ids->mapWithKeys(
                    fn($it, $key) => [
                        $it =>
                            ($this->options->cluster_name_prefix ?? 'Aspek') .
                            ' ' .
                            $key +
                            1,
                    ],
                );
            }

            return $cluster_names;
        });
    }

    public function appendClusterNames(): self
    {
        return $this->append('cluster_names');
    }
}
