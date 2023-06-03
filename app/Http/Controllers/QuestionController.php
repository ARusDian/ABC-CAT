<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionImage;
use App\Models\DocumentFile;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $questions = Question::all();
        return Inertia::render('Admin/Question/Index', [
            'questions' => $questions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('Admin/Question/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $images = $request->images ?? [];
        $availableImages = [];
        $editorContent = $request->content;

        return DB::transaction(function () use ($request, $images, $availableImages, $editorContent) {
           foreach($images as $image) {
            if (str_contains($editorContent, $image)) {
                array_push($availableImages, $image);
            }
            }
            
            $submittedImagesId = [];
            foreach($availableImages as $image) {
                $newImage = str_replace('"', '', $image);
                $newImage = preg_replace('/^data:image\/(png|jpeg|jpg);base64,/', '', $newImage);
                $newImage = str_replace(' ', '+', $newImage);
                $imageName = md5(Carbon::now()).'.png';
                $files = DocumentFile::createFile('public', 'questionImages/'.$imageName, base64_decode($newImage));
                $editorContent = str_replace($image, url('/').'/storage/'.$files->path, $editorContent);
                array_push($submittedImagesId, $files->id);
            }
            $newProgramCommitte = Question::create([
                'content' => $editorContent,
            ]);
            forEach($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $newProgramCommitte->id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()->route('question.index')->banner('Question created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        //
        $question = Question::find($id);
        return Inertia::render('Admin/Question/Show', [
            'question' => $question
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //
        $question = Question::find($id);
        return Inertia::render('Admin/Question/Edit', [
            'question' => $question
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
        $storedPageContentImages = QuestionImage::where('question_id', $id)->get(); 
        $images = $request->images ?? [];
        $availableImages = [];
        $editorContent = $request->content;
        foreach($images as $image) {
            if (str_contains($editorContent, $image)) {
                array_push($availableImages, $image);
            }
        }
        $submittedImagesId = [];

        return DB::transaction(function () use ($request, $images, $availableImages, $editorContent, $storedPageContentImages, $id, $submittedImagesId) {
            foreach($availableImages as $image) {
                $newImage = str_replace('"', '', $image);
                $newImage = preg_replace('/^data:image\/(png|jpeg|jpg);base64,/', '', $newImage);
                $newImage = str_replace(' ', '+', $newImage);
                $imageName = md5(Carbon::now()).'.png';
                $files = DocumentFile::createFile('public', 'questionImages/'.$imageName, base64_decode($newImage));
                $editorContent = str_replace($image, url('/').'/storage/'.$files->path, $editorContent);
                array_push($submittedImagesId, $files->id);
            }
            $question = Question::find($id)->update([
                'content' => $editorContent,
            ]);
            forEach($storedPageContentImages as $storedImage) {
                if (!in_array($storedImage->document_file_id, $submittedImagesId)) {
                    DocumentFile::find($storedImage->document_file_id)->deleteFile();
                    $storedImage->delete();
                }
            }
            forEach($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()->route('question.index')->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
        return DB::transaction(function () use ($id) {
            $question = Question::find($id);
            $questionImages = QuestionImage::where('question_id', $id)->get();
            foreach($questionImages as $questionImage) {
                $image = DocumentFile::find($questionImage->document_file_id);
                $image->deleteFile();
                $image->delete();
                $questionImage->delete();
            }
            $question->delete();
            return redirect()->route('question.index')->banner('Question deleted successfully');
        });
    }
}
