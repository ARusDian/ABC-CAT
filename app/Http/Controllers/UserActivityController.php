<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserActivityController extends Controller
{
    //
    public function index(Request $request)
    {
        return Inertia::render('Admin/UserActivity/Index', [
            'activities' => fn() => Activity::with(['causer'])
                ->whereColumns($request->get('columnFilters'))
                ->orderBy('created_at', 'desc')
                ->paginate(10),
        ]);
    }
}
