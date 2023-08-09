<?php

namespace App\Http\Controllers;

use App\Models\LearningPacket;
use App\Models\User;
use App\Models\UserLearningPacket;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserLearningPacketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $learningPackets = LearningPacket::with([
            'userLearningPackets.user' => function ($query) {
                $query->select('id', 'name', 'email');
            },
        ])->get();
        return Inertia::render('Admin/UserLearningPacket/Index', [
            'learningPackets' => $learningPackets,
        ])->with('success', 'User Learning Packet created successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $users = User::select('id', 'name')->get();
        $learningPackets = LearningPacket::select('id', 'name')->get();
        return Inertia::render('Admin/UserLearningPacket/Create', [
            'users' => $users,
            'learningPackets' => $learningPackets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $userLearningPacket = UserLearningPacket::create([
            'user_id' => $request->user['id'],
            'learning_packet_id' => $request->learning_packet['id'],
        ]);
        activity()
            ->performedOn($userLearningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log('User ' . $userLearningPacket->user->name . ' assigned to learning packet ' . $userLearningPacket->learningPacket->name);

        return redirect()->route('user-learning-packet.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $userLearningPacket = UserLearningPacket::find($id);
        $userLearningPacket->delete();
        activity()
            ->performedOn($userLearningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log('User ' . $userLearningPacket->user->name . ' removed from learning packet ' . $userLearningPacket->learningPacket->name);
        return redirect()->route('user-learning-packet.index')->with('success', 'User Learning Packet deleted successfully');
    }
}
