<?php

namespace App\Http\Controllers;

use App\Exports\UserPacketsExport;
use App\Exports\UserPacketsTemplateExport;
use App\Models\LearningPacket;
use App\Models\User;
use App\Models\UserLearningPacket;
use App\Http\Controllers\Controller;
use App\Imports\UserLearningPacketImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
        $request->validate([
            'user' => 'required | unique:user_learning_packets,user_id',
            'learning_packet' => 'required',
            'subscription_date' => 'required',
        ]);

        $userLearningPacket = UserLearningPacket::create([
            'user_id' => $request->user['id'],
            'learning_packet_id' => $request->learning_packet['id'],
            'subscription_date' => $request->subscription_date,
        ]);
        activity()
            ->performedOn($userLearningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log(
                'User ' .
                    $userLearningPacket->user->name .
                    ' assigned to learning packet ' .
                    $userLearningPacket->learningPacket->name,
            );

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
            ->log(
                'User ' .
                    $userLearningPacket->user->name .
                    ' removed from learning packet ' .
                    $userLearningPacket->learningPacket->name,
            );
        return redirect()
            ->route('user-learning-packet.index')
            ->banner('User Learning Packet deleted successfully');
    }

    public function import(Request $request, $id)
    {
        $request->validate([
            'import_file' => 'required',
        ]);
        $learningPacket = LearningPacket::find($id);
        Excel::import(new UserLearningPacketImport($id), $request->file('import_file.file')->store('temp'));
        activity()
            ->performedOn($learningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'IMPORT'])
            ->log('User Learning Packet imported');
        return redirect()->route('user-learning-packet.index')->banner('User Learning Packet imported successfully');
    }

    public function export($id)
    {
        $learningPacket = LearningPacket::with([
            'userLearningPackets' => function ($q) {
                return $q->with('user:id,name,email');
            }
        ])->find($id);
        activity()
            ->performedOn($learningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'EXPORT'])
            ->log('User Learning Packet exported');
        return Excel::download(new UserPacketsExport($learningPacket), 'user-' . $learningPacket->name . '.xlsx');
    }

    public function template($id)
    {
        $learningPacket = LearningPacket::find($id);
        return Excel::download(new UserPacketsTemplateExport($learningPacket), 'user-' . $learningPacket->name . '-template.xlsx');
    }

    public function users($learning_packet){
        $learningPacket = LearningPacket::with('users:id,name,email')->find($learning_packet);
        $unregisteredUsers = User::whereNotIn(
            'id',
            $learningPacket->users->pluck('id'),
        )->whereDoesntHave('roles', function ($query) {
            $query->where('name', 'admin')->orWhere('name', 'super-admin');
        })->select('id', 'name', 'email')->get();

        return Inertia::render('Admin/UserLearningPacket/User', [
            'learningPacket' => $learningPacket,
            'unregisteredUsers' => $unregisteredUsers,
        ]);
    }
}
