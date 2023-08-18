<?php

namespace App\Http\Controllers;

use App\Models\LearningPacket;
use App\Http\Controllers\Controller;
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
        //
        $learningPackets = LearningPacket::withTrashed()->get();
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
            'photo.file' => 'nullable|max:2048',
        ]);

        $path = null;

        if ($request->hasFile('photo.file')) {
            $path = Storage::disk('public')->put('learning-packet', $request->file('photo.file'));
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
        $learningPacket = LearningPacket::with(
            'subLearningPackets.learningCategories',
        )->withTrashed()->find($id);
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
            'photo.file' => 'nullable|max:2048',
        ]);

        $learningPacket = LearningPacket::find($id);

        if (isset($learningPacket->photo_path)) {
            if ($request->hasFile('photo.file')) {
                Storage::disk('public')->delete($learningPacket->photo_path);
                $path = Storage::disk('public')->put('learning-packet', $request->file('photo.file'));
            } else {
                $path = $learningPacket->photo_path;
            }
        } else {
            if ($request->hasFile('photo.file')) {
                $path = Storage::disk('public')->put('learning-packet', $request->file('photo.file'));
            } else {
                $path = null;
            }
        }
        $learningPacket->update([
            'name' => $request->name,
            'description' => $request->description,
            'photo_path' => $path,
        ]);

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

    public function restore($id)
    {
        $learningPacket = LearningPacket::withTrashed()->find($id);
        $learningPacket->restore();

        activity()
            ->performedOn($learningPacket)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'RESTORE'])
            ->log(
                'Learning Packet ' .
                    $learningPacket->name .
                    ' restored successfully.',
            );

        return redirect()
            ->route('packet.index')
            ->banner('Learning Packet restored successfully.');
    }
}
