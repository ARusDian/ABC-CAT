<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Models\Activity as BaseActivity;

class Activity extends BaseActivity
{
    public function scopeWhereColumns($query, $filters)
    {
        $allowed = ['subject_type', 'causer.name'];

        if (isset($filters)) {
            foreach (json_decode($filters) as $value) {
                $key = explode('.', $value->id);

                switch ($value->id) {
                    case 'Subjek':
                        $value->id = 'subject_type';

                        break;
                }

                if (!in_array($value->id, $allowed)) {
                    continue;
                }

                // dd($value);
                if (count($key) > 1) {
                    // dd($key);
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
