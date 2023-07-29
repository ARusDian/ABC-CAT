import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import TextInput from '@/Components/Jetstream/TextInput';
import TextEditorInput from '@/Components/TextEditorInput';
import { BaseLearningMaterialModel } from '@/Models/LearningMaterial';
import React, { useEffect, useRef, useState } from 'react';
import DocumentForm from './DocumentForm';
import { UseFormReturn } from 'react-hook-form';
import EditorInput from '@/Components/Tiptap/EditorInput';
import { useEditor } from '@/Components/Tiptap/useEditor';
import ResourceEditor from '@/Components/ResourceEditor';

interface Props {
  form: UseFormReturn<BaseLearningMaterialModel>;
  className?: string;
}

export default function Form(props: Props) {
  const form = props.form;

  return (
    <div className={`flex-col gap-5 ${props.className}`}>
      <div className="form-control w-full mt-4">
        <InputLabel htmlFor="title">Judul Materi</InputLabel>
        <TextInput
          id="title"
          type="text"
          className="mt-1 block w-full"
          {...form.register('title')}
          required
          autoFocus
          autoComplete="title"
        />
        <InputError
          className="mt-2"
          message={form.formState.errors.title?.message}
        />
      </div>
      <div className="form-control w-full mt-4">
        <InputLabel htmlFor="description">Deskripsi</InputLabel>
        <ResourceEditor
          content={form.formState.defaultValues?.description?.content ?? null}
          onBlur={json => {
            form.setValue('description.content', json);
          }}
          documentFileType="learning-material"
        />
        <InputError
          className="mt-2"
          message={form.formState.errors.description?.message}
        />
      </div>
      <DocumentForm form={form} />
    </div>
  );
}
