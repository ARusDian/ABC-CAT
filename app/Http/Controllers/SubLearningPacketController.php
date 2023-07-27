<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\SubLearningPacket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubLearningPacketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($learning_packet)
    {
        //
        // $subPacketLearnings = SubLearningPacket::where('packet_learning_id', $learning_packet)->get();
        // return Inertia::render('Admin/Classification/SubLearningPacket/Index', [
        //     'subPacketLearnings' => $subPacketLearnings
        // ]);

        redirect()->route('learning-packet.show', $learning_packet);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet)
    {
        //
        return Inertia::render('Admin/Classification/SubLearningPacket/Create', [
            'learning_packet_id' => $learning_packet
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $learning_packet)
    {
        //
        $request->validate([
            'name' => 'required',
            'learning_packet_id' => 'required',
        ]);

        SubLearningPacket::create($request->all());

        return redirect()->route('learning-packet.show', $request->learning_packet_id)->banner('Sub Learning Packet created successfully.');
        
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $id)
    {
        //
        $subLearningPacket = SubLearningPacket::with('learningCategories')->find($id);
        return Inertia::render('Admin/Classification/SubLearningPacket/Show', [
            'subLearningPacket' => $subLearningPacket
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $id)
    {
        //
        $subLearningPacket = SubLearningPacket::find($id);
        return Inertia::render('Admin/Classification/SubLearningPacket/Edit', [
            'subLearningPacket' => $subLearningPacket
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $learning_packet,  $id)
    {
        //
        $request->validate([
            'name' => 'required',
        ]);

        $subLearningPacket = SubLearningPacket::find($id);
        $subLearningPacket->update($request->all());

        return redirect()->route('learning-packet.show', $subLearningPacket->learning_packet_id)->banner('Sub Learning Packet updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $id)
    {
        //
        $subLearningPacket = SubLearningPacket::find($id);
        $subLearningPacket->delete();

        return redirect()->route('learning-packet.show', $subLearningPacket->learning_packet_id)->banner('Sub Learning Packet deleted successfully.');
    }
}
