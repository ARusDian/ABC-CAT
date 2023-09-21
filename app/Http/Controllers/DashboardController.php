<?php

namespace App\Http\Controllers;

use App\Models\BankQuestionItem;
use App\Models\LearningPacket;
use App\Models\User;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
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

    public function guide()
    {
        return Inertia::render('Admin/Guide');
    }

    public function guideDownload(): BinaryFileResponse
    {
        $user = auth()->user();
        $filename = '';
        if ($user->hasRole('super-admin')) {
            $filename = 'guide_admin.pdf';
        } elseif ($user->hasRole('instructor')) {
            $filename = 'guide_instructor.pdf';
        } else {
            return abort(403);
        }
        return response()->download(
            public_path('assets/documents/' . $filename),
        );
    }
}
