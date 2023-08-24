<?php

namespace App\Models;

use Carbon\Carbon;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Casts\AsCollection;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Znck\Eloquent\Relations\BelongsToThrough;

class Exam extends Model
{
    use HasFactory;
    use Cachable;
    use \Znck\Eloquent\Traits\BelongsToThrough;

    protected $fillable = [
        'user_id',
        'exercise_question_id',
        'expire_in',
        'finished_at',
        'server_state',
        'cluster',
        'options',
    ];

    protected $casts = [
        'expire_in' => 'datetime',
        'finished_at' => 'datetime',
        'server_state' => 'array',
        'cluster' => AsArrayObject::class,
        'options' => 'object',
    ];

    protected $appends = ['finished'];

    public function answers(): HasMany
    {
        return $this->hasMany(ExamAnswer::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function exerciseQuestion(): BelongsTo
    {
        return $this->belongsTo(ExerciseQuestion::class)->withTrashed();
    }

    public function learningCategory(): BelongsToThrough
    {
        return $this->belongsToThrough(LearningCategory::class, [ExerciseQuestion::class]);
    }

    public function scopeOfExercise($query, $exercise_question_id)
    {
        return $query->where('exercise_question_id', $exercise_question_id);
    }

    public function scopeOfUser($query, $user_id)
    {
        return $query->where('user_id', $user_id);
    }

    public function scopeOfFinished($query, bool $finished)
    {
        if ($finished) {
            return $query->whereNotNull('finished_at');
        } else {
            return $query->disableCache()->whereNull('finished_at');
        }
    }

    public function scopeWithScore($query, bool $state = true)
    {
        if ($state) {
            return $query->withSum('answers', 'score')->withCount('answers');
        } else {
            return $query;
        }
    }

    public function isExpired(): bool
    {
        return $this->expire_in < Carbon::now();
    }

    public function finished(): Attribute
    {
        return Attribute::get(fn() => $this->finished_at != null);
    }

    public function markClusterChange(Carbon $date)
    {
        $last_change_cluster = $this->last_change_cluster;

        $changed =
            $date->getTimestampMs() - $last_change_cluster->getTimestampMs();
        $this->cluster[$this->current_cluster]['counter'] += $changed;

        $last_change_cluster = $date;

        $this->server_state = [
            ...$this->server_state,
            'last_change_cluster' => $last_change_cluster,
        ];
    }

    public function setCurrentQuestion(ExamAnswer $value, Carbon $date)
    {
        if ($value->cluster != $this->current_cluster) {
            $this->markClusterChange($date);
        }

        $this->server_state = [
            ...$this->server_state,
            'current_question' => $value->question_number,
            'current_cluster' => $value->cluster,
            'current_exam_answer_id' => $value->id,
        ];
    }

    public function currentQuestion(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->server_state['current_question'],
        )->withoutObjectCaching();
    }

    public function currentCluster(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->server_state['current_cluster'],
            // set: function ($value) {
            //     return $this->server_state->current_cluster = $value;
            // },
        )->withoutObjectCaching();
    }

    public function lastChangeCluster(): Attribute
    {
        return Attribute::make(
            get: fn() => Carbon::parse(
                $this->server_state['last_change_cluster'],
            ),
        )->withoutObjectCaching();
    }

    public function currentCounter(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->cluster[$this->current_cluster]['counter'] ?? 0,
        );
    }

    public function result(): Attribute
    {
        return Attribute::get(function () {
            $cluster = $this->answers->groupBy('cluster');

            \Log::info('called');

            $result = $cluster->map(function ($c, $key) {
                $count = $c->count();
                $correct = $c->whereNotIn('score', [0])->count();
                $answered = $c->whereNotNull('answer');
                $score = $c->sum('score');

                return [
                    'correct' => $correct,
                    'incorrect' => $count - $correct,
                    'count' => $c->count(),
                    'score' => $score,
                    'answered' => $answered->count(),
                ];
            });

            return $result;
        })->shouldCache();
    }

    public function appendResult(): self
    {
        $this->exerciseQuestion->appendClusterNames();

        return $this->append('result');
    }

    public function scopeWhereColumns($query, $filters)
    {
        $allowed = ['user.name'];

        if (isset($filters)) {
            foreach (json_decode($filters) as $value) {
                $key = explode('.', $value->id);

                if (!in_array($value->id, $allowed)) {
                    continue;
                }

                if (count($key) > 1) {
                    $query->whereHas($key[0], function ($query) use (
                        $value,
                        $key,
                    ) {
                        return $query->where(
                            $key[1],
                            'like',
                            '%' . $value->value . '%',
                        );
                    });
                } else {
                    $query->where(
                        $value->id,
                        'like',
                        '%' . $value->value . '%',
                    );
                }
            }
        }

        return $query;
    }
}
