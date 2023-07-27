<?php

namespace App\Http\Controllers;

use App\Models\LearningCategory;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LearningCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($learning_packet, $sub_learning_packet)
    {
        //
        return redirect()->route('learning-packet.sub-learning-packet.show', [$learning_packet, $sub_learning_packet]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet, $sub_learning_packet)
    {
        //
        return Inertia::render('Admin/Classification/LearningCategory/Create', [
            'learning_packet_id' => $learning_packet,
            'sub_learning_packet_id' => $sub_learning_packet
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $learning_packet, $sub_learning_packet)
    {
        //
        $request->validate([
            'name' => 'required',
            'sub_learning_packet_id' => 'required',
        ]);

        LearningCategory::create($request->all());

        return redirect()->route('learning-packet.sub-learning-packet.show', [$learning_packet, $request->sub_learning_packet_id])->banner('Learning Category created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $sub_learning_packet, $id)
    {
        //
        $learningCategory = LearningCategory::with([
            'subLearningPacket',
            'subLearningPacket.learningPacket',
            'learningMaterials.documents.documentFile',
            'bankQuestions.items',
            'exerciseQuestions.questions'
        ])->find($id);
        return Inertia::render('Admin/Classification/LearningCategory/Show', [
            'learningCategory' => $learningCategory
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $sub_learning_packet, $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $learning_packet, $sub_learning_packet, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $sub_learning_packet, $id)
    {
        //
    }
}
