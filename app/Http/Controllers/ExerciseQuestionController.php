<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Models\ExerciseQuestion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExerciseQuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Admin/ExerciseQuestion/Index", [
            'exercise_questions' => fn () => ExerciseQuestion::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Admin/ExerciseQuestion/Create", []);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required|string'
        ]);

        $exercise = ExerciseQuestion::create([
            'name' => $data['name']
        ]);

        return redirect()->route('exercise-question.show', [$exercise->id])->banner('Soal Latihan berhasil dibuat');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render("Admin/ExerciseQuestion/Show", [
            'exercise_question' => fn () => ExerciseQuestion::with(['questions'])->findOrFail($id)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render("Admin/ExerciseQuestion/Edit", [
            'exercise_question' => fn () => ExerciseQuestion::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->validate([
            'name' => 'required|string'
        ]);


        $exercise = ExerciseQuestion::findOrFail($id);
        $exercise->update([
            'name' => $data['name']
        ]);

        return redirect()->route('exercise-question.show', [$id])->banner("Soal Lathian berhasil diedit");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function uploadImage(Request $request, $exercise_question) {
        $file =  $request->file('file');

        return DocumentFile::createFile('public', "exercise-question/$exercise_question", $file, auth()->id());
    }
}
