<?php

namespace App\Http\Controllers;

use App\Models\Research\Research;
use App\Models\Research\ResearchDocument;
use App\Models\Research\ResearchType;
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
            return Inertia::render('Student/Dashboard');
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
