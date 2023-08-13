<?php

namespace App\Http\Controllers;

use App\Models\LearningPacket;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningPacketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $learningPackets = LearningPacket::all();
        return Inertia::render('Admin/Classification/LearningPacket/Index', [
            'learningPackets' => $learningPackets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Admin/Classification/LearningPacket/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $learning_packet = LearningPacket::create($request->all());
        activity()
            ->performedOn($learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log(
                'Learning Packet ' .
                    $learning_packet->name .
                    ' created successfully.',
            );

        return redirect()
            ->route('packet.index')
            ->banner('Learning Packet created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $learningPacket = LearningPacket::with(
            'subLearningPackets.learningCategories',
        )->find($id);
        return Inertia::render('Admin/Classification/LearningPacket/Show', [
            'learningPacket' => $learningPacket,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $learningPacket = LearningPacket::find($id);
        return Inertia::render('Admin/Classification/LearningPacket/Edit', [
            'learningPacket' => $learningPacket,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $learningPacket = LearningPacket::find($id);
        $learningPacket->update($request->all());

        activity()
            ->performedOn($learningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'UPDATE'])
            ->log(
                'Learning Packet ' .
                    $learningPacket->name .
                    ' updated successfully.',
            );

        return redirect()
            ->route('packet.show', $id)
            ->banner('Learning Packet updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        $learningPacket = LearningPacket::find($id);
        $learningPacket->delete();

        activity()
            ->performedOn($learningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log(
                'Learning Packet ' .
                    $learningPacket->name .
                    ' deleted successfully.',
            );

        return redirect()
            ->route('packet.index')
            ->banner('Learning Packet deleted successfully.');
    }
}
