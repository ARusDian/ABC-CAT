<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LearningPacket;
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

        redirect()->route('packet.show', $learning_packet);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet)
    {
        //
        return Inertia::render(
            'Admin/Classification/SubLearningPacket/Create',
            [
                'learning_packet_id' => $learning_packet,
            ],
        );
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

        $sub_learning_packet = SubLearningPacket::create($request->all());

        activity()
            ->performedOn($sub_learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log(
                'Sub Learning Packet ' .
                    $request->name .
                    ' created successfully.',
            );

        return redirect()
            ->route('packet.show', $request->learning_packet_id)
            ->banner('Sub Learning Packet created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $id)
    {
        //
        $sub_learning_packet = SubLearningPacket::with(
            'learningCategories',
        )->find($id);
        return Inertia::render('Admin/Classification/SubLearningPacket/Show', [
            'sub_learning_packet' => $sub_learning_packet,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $id)
    {
        //
        $sub_learning_packet = SubLearningPacket::find($id);
        return Inertia::render('Admin/Classification/SubLearningPacket/Edit', [
            'sub_learning_packet' => $sub_learning_packet,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $learning_packet, $id)
    {
        //
        $request->validate([
            'name' => 'required',
        ]);

        $sub_learning_packet = SubLearningPacket::find($id);
        $sub_learning_packet->update($request->all());

        activity()
            ->performedOn($sub_learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'UPDATE'])
            ->log(
                'Sub Learning Packet ' .
                    $sub_learning_packet->name .
                    ' updated successfully.',
            );

        return redirect()
            ->route('packet.sub.show', [
                $learning_packet,
                $sub_learning_packet->learning_packet_id,
            ])
            ->banner('Sub Learning Packet updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $id)
    {
        //
        $sub_learning_packet = SubLearningPacket::find($id);
        $sub_learning_packet->delete();

        activity()
            ->performedOn($sub_learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log(
                'Sub Learning Packet ' .
                    $sub_learning_packet->name .
                    ' deleted successfully.',
            );

        return redirect()
            ->route('packet.show', $sub_learning_packet->learning_packet_id)
            ->banner('Sub Learning Packet deleted successfully.');
    }

    public function studentIndex($learning_packet)
    {
        return Inertia::render('Student/SubLearningPacket', [
            'learningPacket' => fn () => LearningPacket::with([
                'subLearningPackets.learningCategories',
            ])->findOrFail($learning_packet),
        ]);
    }
}
