import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import TextInput from '@/Components/Jetstream/TextInput';
import TextEditorInput from '@/Components/TextEditorInput';
import { BaseLearningMaterialModel } from '@/Models/LearningMaterial';
import { InertiaFormProps } from '@inertiajs/inertia-react';
import React, { useEffect, useRef, useState } from 'react';
import DocumentForm from './DocumentForm';

interface Props {
  form: InertiaFormProps<BaseLearningMaterialModel>;
  className?: string;
}

export default function Form(props: Props) {
  const form = props.form;
  const [images, setImages] = useState<string[]>([]);
  const editorRef = useRef();

  useEffect(() => {
    form.setData('images', images);
  }, [images]);

  function handleDataChange<K extends keyof BaseLearningMaterialModel, V>(
    name: K,
    callback?: (arg: BaseLearningMaterialModel[K], value: V) => void,
  ) {
    return (value: V) => {
      if (callback != null) {
        callback(form.data[name], value);
      }

      form.setData(name, form.data[name]);
    };
  }

  return (
    <div className={`flex-col gap-5 ${props.className}`}>
      <div className="form-control w-full mt-4">
        <InputLabel htmlFor="title">Judul Materi</InputLabel>
        <TextInput
          id="title"
          type="text"
          className="mt-1 block w-full"
          value={form.data.title}
          onChange={e => form.setData('title', e.currentTarget.value)}
          required
          autoFocus
          autoComplete="title"
        />
        <InputError className="mt-2" message={form.errors.title} />
      </div>
      <div className="form-control w-full mt-4">
        <InputLabel htmlFor="description">Deskripsi</InputLabel>
        <TextEditorInput
          contentValue={form.data.description}
          contentValueHandler={(value: unknown) =>
            form.setData('description', value as string)
          }
          imageValue={form.data.images ?? []}
          imageValueHandler={setImages}
          editorRef={editorRef}
        />
        <InputError className="mt-2" message={form.errors.description} />
      </div>
      <DocumentForm
        form={form}
        documents={form.data.documents}
        onChange={handleDataChange('documents')}
      />
    </div>
  );
}
