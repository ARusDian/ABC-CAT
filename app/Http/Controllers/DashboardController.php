<?php

namespace App\Http\Controllers;

use App\Models\LearningPacket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //
    public function index()
    {
        if (
            auth()
            ->user()
            ->hasRole('student')
        ) {
            return Inertia::render(
                'Student/Dashboard',
                [
                    'userLearningPackets' => auth()->user()->userLearningPackets,
                    'learningPackets' => LearningPacket::all(),
                ]
            );
        } elseif (
            auth()
            ->user()
            ->hasRole('admin') ||
            auth()
            ->user()
            ->hasRole('super-admin')
        ) {
            return Inertia::render('Admin/Dashboard');
        }
    }
}
