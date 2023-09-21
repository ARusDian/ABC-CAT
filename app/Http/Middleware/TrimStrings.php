<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\TrimStrings as Middleware;

class TrimStrings extends Middleware
{
    /**
     * The names of the attributes that should not be trimmed.
     *
     * @var array<int, string>
     */
    protected $except = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    protected $exceptRegex = ['content.*.text'];

    public function transform($key, $value)
    {
        foreach ($this->exceptRegex as $pattern) {
            if (preg_match('/' . $pattern . '/', $key)) {
                return $value;
            }
        }

        return parent::transform($key, $value);
    }
}
