<?php

namespace App\Http\Middleware;

use App\Models\Exam;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckExamMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $userId = auth()->id();
        if (auth()->id()) {
            $exam = Exam::ofUser($userId)->ofFinished(false)->first();

            if ($exam) {
                return redirect()->route('student.exam.show', [$exam->exercise_question_id]);
            }
        }
        return $next($request);
    }
}
