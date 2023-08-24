<?php

namespace App\Http\Controllers;

use App\Models\LearningCategory;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($learning_packet, $sub_learning_packet)
    {
        //
        return redirect()->route('packet.sub.show', [
            $learning_packet,
            $sub_learning_packet,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet, $sub_learning_packet)
    {
        //
        return Inertia::render('Admin/Classification/LearningCategory/Create', [
            'learning_packet_id' => $learning_packet,
            'sub_learning_packet_id' => $sub_learning_packet,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
    ) {
        //
        $request->validate([
            'name' => 'required',
        ]);

        $learningCategory = LearningCategory::create([
            'name' => $request->name,
            'sub_learning_packet_id' => $sub_learning_packet,
        ]);

        activity()
            ->performedOn($learningCategory)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'CREATE'])
            ->log(
                'Learning Category ' .
                    $request->name .
                    ' created successfully.',
            );

        return redirect()
            ->route('packet.sub.show', [$learning_packet, $sub_learning_packet])
            ->banner('Learning Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $sub_learning_packet, $id)
    {
        $learningCategory = LearningCategory::with([
            'subLearningPacket',
            'subLearningPacket.learningPacket',
            'learningMaterials.documents.documentFile',
            'bankQuestions.items',
            'exerciseQuestions' => function ($q) {
                return $q->withTrashed()->orderBy('id', 'asc');
            },
        ])->find($id);

        Gate::authorize('view', $learningCategory);

        return Inertia::render('Admin/Classification/LearningCategory/Show', [
            'learning_category' => $learningCategory,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $sub_learning_packet, $id)
    {
        $learningCategory = LearningCategory::findOrFail($id);
        Gate::authorize('update', $learningCategory);
        return Inertia::render('Admin/Classification/LearningCategory/Edit', [
            'learning_category' => $learningCategory,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        $learning_packet,
        $sub_learning_packet,
        $id,
    ) {
        //
        $validated = $request->validate([
            'name' => 'required',
        ]);

        $learningCategory = LearningCategory::find($id);
        Gate::authorize('update', $learningCategory);

        $learningCategory->update([
            'name' => $validated['name'],
            'sub_learning_packet_id' => $sub_learning_packet,
        ]);

        activity()
            ->performedOn($learningCategory)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'UPDATE'])
            ->log(
                'Learning Category ' .
                    $request->name .
                    ' updated successfully.',
            );

        return redirect()
            ->route('packet.sub.category.show', [
                $learning_packet,
                $sub_learning_packet,
                $id,
            ])
            ->banner('Learning Category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $sub_learning_packet, $id)
    {
        //
        $learningCategory = LearningCategory::findOrFail($id);
        Gate::authorize('delete', $learningCategory);

        $learningCategory->delete();

        activity()
            ->performedOn($learningCategory)
            ->causedBy(auth()->user())
            ->withProperties(['method' => 'DELETE'])
            ->log(
                'Learning Category ' .
                    $learningCategory->name .
                    ' deleted successfully.',
            );

        return redirect()
            ->route('packet.sub.show', [$learning_packet, $sub_learning_packet])
            ->banner('Learning Category deleted successfully.');
    }
}
