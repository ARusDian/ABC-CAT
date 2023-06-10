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

    public function replaceImage(&$image, &$editor): DocumentFile
    {
        $newImage = str_replace('"', '', $image);
        $newImage = preg_replace('/^data:image\/(png|jpeg|jpg);base64,/', '', $newImage);
        $newImage = str_replace(' ', '+', $newImage);
        $imageName = md5(Carbon::now()) . '.png';
        $files = DocumentFile::createFile('public', 'questionImages/' . $imageName, base64_decode($newImage));
        $editor = str_replace($image, url('/') . '/storage/' . $files->path, $editor);

        return $files;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $images = $request->images ?? [];
            $editorContent = $request->content;
            $answers = $request->answers;

            $submittedImagesId = [];
            foreach ($images as $image) {
                $files = null;
                if (str_contains($editorContent, $image)) {
                    $files = $this->replaceImage($image, $editorContent);
                }

                foreach ($answers as &$answer) {
                    if (str_contains($answer, $image)) {
                        $files = $this->replaceImage($image, $answer);
                    }
                }

                if ($files != null) {
                    array_push($submittedImagesId, $files->id);
                }
            }

            $newQuestion = Question::create([
                'content' => $editorContent,
                'answers' => $answers,
            ]);

            foreach ($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $newQuestion->id,
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
        return DB::transaction(function () use ($request, $id) {
            $storedPageContentImages = QuestionImage::where('question_id', $id)->get();
            $images = $request->images ?? [];
            $answers = $request->answers;
            $editorContent = $request->content;
            $submittedImagesId = [];
            foreach ($images as $image) {
                $files = null;
                if (str_contains($editorContent, $image)) {
                    $files = $this->replaceImage($image, $editorContent);
                }

                foreach ($answers as &$answer) {
                    if (str_contains($answer, $image)) {
                        $files = $this->replaceImage($image, $answer);
                    }
                }

                if ($files != null) {
                    array_push($submittedImagesId, $files->id);
                }
            }

            $question = Question::find($id)->update([
                'content' => $editorContent,
                'answers' => $answers,
            ]);

            foreach ($storedPageContentImages as $storedImage) {
                if (!in_array($storedImage->document_file_id, $submittedImagesId)) {
                    DocumentFile::find($storedImage->document_file_id)->deleteFile();
                    $storedImage->delete();
                }
            }
            foreach ($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()->route('question.show', $id)->banner('Question updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $question = Question::find($id);
            $questionImages = QuestionImage::where('question_id', $id)->get();
            foreach ($questionImages as $questionImage) {
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
