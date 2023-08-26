<?php

namespace App\Http\Controllers;

use App\Models\DocumentFile;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Storage;

class DocumentFileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => [
                'required',
                Rule::in(['learning-material', 'bank-question', 'question']),
            ],
            'file' => 'required|image',
        ]);
        $file = $request->file('file');

        $path = '';

        switch ($data['type']) {
            case 'learning-material':
                $path = 'learning-material';
                break;
            case 'bank-question':
                $path = 'bank-question';
                break;
            case 'question':
                $path = 'question';
                break;
        }

        return DocumentFile::createFile('public', $path, $file, auth()->id());
    }

    /**
     * Display the specified resource.
     */
    public function showFile(DocumentFile $file)
    {
        return Storage::disk($file->disk)->response($file->path);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentFile $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFile $file)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFile $file)
    {
        //
    }
}
