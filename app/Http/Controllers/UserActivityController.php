<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class UserActivityController extends Controller
{
    //
    public function index()
    {
        $activities = Activity::with(['causer'])->get();

        return Inertia::render('Admin/UserActivity/Index', [
            'activities' => $activities,
        ]);
    }
}
