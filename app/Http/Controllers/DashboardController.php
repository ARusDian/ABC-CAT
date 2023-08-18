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
                'userLearningPackets' => auth()->user()->userLearningPackets,
                'learningPackets' => LearningPacket::all(),
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

            $learning_packets = LearningPacket::with([
                'learningCategories.bankQuestions.items',
            ])
                ->withCount(['users'])
                ->get();

            foreach ($learning_packets as $learning_packet) {
                $learning_packet[
                    'bank_question_items_count'
                ] = $learning_packet->learningCategories
                    ->map(function ($learning_category) {
                        return $learning_category
                            ->bankQuestions()
                            ->withCount('items')
                            ->get()
                            ->map(function ($bank_question) {
                                return $bank_question->items_count;
                            })
                            ->sum();
                    })
                    ->sum();
            }

            $sum_of_bank_question_items = BankQuestionItem::all()->count();
            return Inertia::render('Admin/Dashboard', [
                'users_count' => $users_count,
                'students_count' => $students_count,
                'learning_packets' => $learning_packets,
                'sum_of_bank_question_items' => $sum_of_bank_question_items,
            ]);
        }
    }
}
