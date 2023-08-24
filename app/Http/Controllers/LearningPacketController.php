<?php

namespace App\Http\Controllers;

use App\Models\LearningPacket;
use App\Http\Controllers\Controller;
use Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LearningPacketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $learning_packets = LearningPacket::withTrashed()
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Classification/LearningPacket/Index', [
            'learning_packets' => $learning_packets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Gate::authorize('create', new LearningPacket);
        return Inertia::render('Admin/Classification/LearningPacket/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Gate::authorize('create', new LearningPacket);

        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'photo.file' => 'nullable|max:2048',
        ]);

        $path = null;

        if ($request->hasFile('photo.file')) {
            $path = Storage::disk('public')->put(
                'learning-packet',
                $request->file('photo.file'),
            );
        }

        $learning_packet = LearningPacket::create([
            'name' => $request->name,
            'description' => $request->description,
            'photo_path' => $path,
        ]);

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
        $learning_packet = LearningPacket::with([
            'subLearningPackets' => function ($query) {
                $query->orderBy('id', 'asc');
            },
            'subLearningPackets.learningCategories',
        ])
            ->withTrashed()
            ->find($id);
        return Inertia::render('Admin/Classification/LearningPacket/Show', [
            'learning_packet' => $learning_packet,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $learning_packet = LearningPacket::find($id);
        return Inertia::render('Admin/Classification/LearningPacket/Edit', [
            'learning_packet' => $learning_packet,
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
            'photo.file' => 'nullable|max:2048',
        ]);

        $learning_packet = LearningPacket::find($id);

        if (isset($learning_packet->photo_path)) {
            if ($request->hasFile('photo.file')) {
                Storage::disk('public')->delete($learning_packet->photo_path);
                $path = Storage::disk('public')->put(
                    'learning-packet',
                    $request->file('photo.file'),
                );
            } else {
                $path = $learning_packet->photo_path;
            }
        } else {
            if ($request->hasFile('photo.file')) {
                $path = Storage::disk('public')->put(
                    'learning-packet',
                    $request->file('photo.file'),
                );
            } else {
                $path = null;
            }
        }
        $learning_packet->update([
            'name' => $request->name,
            'description' => $request->description,
            'photo_path' => $path,
        ]);

        activity()
            ->performedOn($learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'UPDATE'])
            ->log(
                'Learning Packet ' .
                    $learning_packet->name .
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
        $learning_packet = learningPacket::find($id);
        $learning_packet->delete();

        activity()
            ->performedOn($learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log(
                'Learning Packet ' .
                    $learning_packet->name .
                    ' deleted successfully.',
            );

        return redirect()
            ->route('packet.index')
            ->banner('Learning Packet deleted successfully.');
    }

    public function restore($id)
    {
        $learning_packet = LearningPacket::withTrashed()->find($id);
        $learning_packet->restore();

        activity()
            ->performedOn($learning_packet)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'RESTORE'])
            ->log(
                'Learning Packet ' .
                    $learning_packet->name .
                    ' restored successfully.',
            );

        return redirect()
            ->route('packet.index')
            ->banner('Learning Packet restored successfully.');
    }
}
