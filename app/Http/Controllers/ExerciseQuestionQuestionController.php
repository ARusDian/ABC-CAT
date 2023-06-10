<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\QuestionImage;
use App\Models\DocumentFile;
use App\Http\Controllers\Controller;
use App\Models\ExerciseQuestion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExerciseQuestionQuestionController extends Controller
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
    public function create($exercise_question)
    {
        return Inertia::render('Admin/ExerciseQuestion/Question/Create', [
            'exercise_question' => ExerciseQuestion::findOrFail($exercise_question)
        ]);
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
    public function store(Request $request, $exercise_question)
    {

        return DB::transaction(function () use ($request, $exercise_question) {
            $images = $request->images ?? [];
            $editorContent = $request->content;
            $answers = $request->answers;
            $type = $request->type;
            $weight = $request->weight;

            $submittedImagesId = [];
            foreach ($images as $image) {
                if (str_contains($editorContent, $image)) {
                    $files = $this->replaceImage($image, $editorContent);
                    array_push($submittedImagesId, $files->id);
                }
            }

            $beforeAnswers = $answers;
            if ($type == 'pilihan') {
                foreach ($answers['choices'] as $key => $answer) {
                    $content = $answer['content'];
                    foreach ($answer['images'] as $image) {
                        if (str_contains($content, $image)) {
                            $files = $this->replaceImage($image, $content);
                            array_push($submittedImagesId, $files->id);
                        }
                    }

                    $answers['choices'][$key] = $content;
                }
            }
            $newQuestion = Question::create([
                'exercise_question_id' => $exercise_question,
                'content' => $editorContent,
                // masukin contentnya answer aja
                'answers' => $answers,
                'type' => $type,
                'weight' => $weight,
            ]);

            foreach ($submittedImagesId as $imageId) {
                QuestionImage::create([
                    'question_id' => $newQuestion->id,
                    'document_file_id' => $imageId,
                ]);
            }
            return redirect()->route('exercise-question.show', [$exercise_question])->banner('Question created successfully');
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
