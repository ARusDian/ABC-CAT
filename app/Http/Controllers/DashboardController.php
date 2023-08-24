<?php

namespace App\Http\Controllers;

use App\Models\BankQuestionItem;
use App\Models\LearningPacket;
use App\Models\User;
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
            return Inertia::render('Student/Dashboard', [
                'user_learning_packets' => auth()->user()->userLearningPackets,
                'learning_packets' => LearningPacket::orderBy(
                    'id',
                    'asc',
                )->get(),
            ]);
        } elseif (
            auth()
                ->user()
                ->hasRole('admin') ||
            auth()
                ->user()
                ->hasRole('super-admin') ||
            auth()
                ->user()
                ->hasRole('instructor')
        ) {
            $users_count = User::all()->count();
            $students_count = User::role('student')->count();

            $learning_packets = LearningPacket::orderBy('id', 'asc')
                ->withCount(['users', 'bankQuestionItems'])
                ->get();

            $sum_of_bank_question_items = BankQuestionItem::count();
            return Inertia::render('Admin/Dashboard', [
                'users_count' => $users_count,
                'students_count' => $students_count,
                'learning_packets' => $learning_packets,
                'sum_of_bank_question_items' => $sum_of_bank_question_items,
            ]);
        }
    }
}
