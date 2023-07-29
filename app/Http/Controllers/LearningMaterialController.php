<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use App\Models\LearningMaterialDescriptionImage;
use App\Models\LearningMaterialDocument;
use App\Models\DocumentFile;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LearningMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $learningMaterials = LearningMaterial::all();
        return Inertia::render('Admin/LearningMaterial/Index', [
            'learningMaterials' => $learningMaterials,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($learning_packet, $sub_learning_packet, $learning_category)
    {
        //
        return Inertia::render('Admin/LearningMaterial/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $learning_packet, $sub_learning_packet, $learning_category)
    {
        //
        return DB::transaction(function () use (
            $request,
            $learning_packet,
            $sub_learning_packet,
            $learning_category,
        ) {
            $editorContent = $request->description;


            $learningMaterial = LearningMaterial::create([
                'title' => $request->title,
                'description' => $editorContent,
                'learning_category_id' => $learning_category,
            ]);

            foreach ($request->documents as $i => $document) {
                $documentName =
                    md5(Carbon::now() . $i) .
                    '.' .
                    $document['document_file']['file']->getClientOriginalExtension();

                $documentFile = DocumentFile::createFile(
                    'public',
                    'learning-material/' . $documentName,
                    $document['document_file']['file'],
                );
                LearningMaterialDocument::create([
                    'caption' => $document['caption'],
                    'learning_material_id' => $learningMaterial->id,
                    'document_file_id' => $documentFile->id,
                ]);
            }
            return redirect()
                ->route('packet.packet.category.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category,
                ])
                ->with('success', 'Learning Material created successfully');
        });
    }

    /**
     * Display the specified resource.
     */
    public function show($learning_packet, $sub_learning_packet, $learning_category, $id)
    {
        //
        $learningMaterial = LearningMaterial::with(
            'documents.documentFile',
        )->find($id);
        return Inertia::render('Admin/LearningMaterial/Show', [
            'learningMaterial' => $learningMaterial,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($learning_packet, $sub_learning_packet, $learning_category, $id)
    {
        //
        $learningMaterial = LearningMaterial::with(
            'documents.documentFile',
        )->find($id);
        return Inertia::render('Admin/LearningMaterial/Edit', [
            'learningMaterial' => $learningMaterial,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $learning_packet, $sub_learning_packet, $learning_category, $id)
    {
        //
        return DB::transaction(function () use ($request, $learning_packet, $sub_learning_packet, $learning_category, $id) {
            $editorContent = $request->description;

            $learningMaterialDescriptionImages = LearningMaterialDescriptionImage::with(
                'documentFile',
            )
                ->where('learning_material_id', $id)
                ->get();

            $learningMaterial = LearningMaterial::find($id);
            $learningMaterial->update([
                'title' => $request->title,
                'description' => $editorContent,
                'learning_category_id' => $learning_category,
            ]);


            // Edit Document

            $deletedDocumentsId = array_diff(
                $learningMaterial->documents->pluck('id')->toArray(),
                array_column($request->documents, 'id'),
            );
            $learningMaterialDocuments = LearningMaterialDocument::with(
                'documentFile',
            )
                ->where('learning_material_id', $id)
                ->get();

            if (count($deletedDocumentsId) > 0) {
                foreach ($learningMaterialDocuments as $document) {
                    if (in_array($document->id, $deletedDocumentsId)) {
                        $document->documentFile->deleteFile();
                        $document->documentFile->delete();
                        $document->delete();
                    }
                }
            }

            foreach ($request->documents as $i => $document) {
                $documentFile = null;
                if (isset($document['document_file']['id'])) {
                    $documentFile = DocumentFile::find(
                        $document['document_file']['id'],
                    );
                    if (isset($document['document_file']['file'])) {
                        $documentFile->replaceFile(
                            $document['document_file']['file'],
                        );
                    }
                } else {
                    $documentName =
                        md5(Carbon::now() . $i) .
                        '.' .
                        $document['document_file']['file']->getClientOriginalExtension();
                    $documentFile = DocumentFile::createFile(
                        'public',
                        'learning-material/' . $documentName,
                        base64_decode(
                            chunk_split(
                                base64_encode(
                                    file_get_contents(
                                        $document['document_file']['file'],
                                    ),
                                ),
                            ),
                        ),
                    );
                }
                LearningMaterialDocument::updateOrCreate(
                    [
                        'id' => $document['id'] ?? null,
                    ],
                    [
                        'caption' => $document['caption'],
                        'learning_material_id' => $learningMaterial->id,
                        'document_file_id' => $documentFile->id,
                    ],
                );
            }
            return redirect()
                ->route('packet.packet.category.material.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category,
                    $id,
                ])
                ->with('success', 'Learning Material updated successfully');
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($learning_packet, $sub_learning_packet, $learning_category, $id)
    {
        //
        return DB::transaction(function () use ($learning_packet, $sub_learning_packet, $learning_category, $id) {
            $learningMaterial = LearningMaterial::find($id);
            $learningMaterialDocuments = LearningMaterialDocument::with(
                'documentFile',
            )
                ->where('learning_material_id', $id)
                ->get();
            $learningMaterialDescriptionImages = LearningMaterialDescriptionImage::with(
                'documentFile',
            )
                ->where('learning_material_id', $id)
                ->get();
            foreach ($learningMaterialDocuments as $document) {
                $document->documentFile->deleteFile();
                $document->documentFile->delete();
                $document->delete();
            }
            foreach ($learningMaterialDescriptionImages as $image) {
                $image->documentFile->deleteFile();
                $image->documentFile->delete();
                $image->delete();
            }
            $learningMaterial->delete();
            return redirect()
                ->route('packet.packet.category.show', [
                    $learning_packet,
                    $sub_learning_packet,
                    $learning_category,
                ])
                ->with('success', 'Learning Material deleted successfully');
        });
    }

    public function studentIndex($learning_packet, $sub_learning_packet, $learning_category)
    {
        //
        $learningMaterials = LearningMaterial::with(
            'documents.documentFile',
        )->where('learning_category_id', $learning_category)->get();
        return Inertia::render('Student/LearningMaterial/Index', [
            'learningMaterials' => $learningMaterials,
        ]);
    }

    public function studentShow($learning_packet, $sub_learning_packet, $learning_category, $id)
    {
        //
        $document = LearningMaterialDocument::with(
            'documentFile',
        )->find($id);
        return Inertia::render('Student/LearningMaterial/Show', [
            'document' => $document,
        ]);
    }
}
