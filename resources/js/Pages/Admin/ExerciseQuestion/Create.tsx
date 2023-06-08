import React from 'react';
import route from 'ziggy-js';

import { useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/AdminFormLayout';
import { ExerciseQuestionFormModel } from '@/Models/ExerciseQuestion';

interface Props {}

export default function Create(props: Props) {
  let form = useForm<ExerciseQuestionFormModel>({
    name: '',
  });

  function onSubmit(e: React.FormEvent) {
    console.log(form.data);
    e.preventDefault();
    form.clearErrors();
    form.post(route('exercise-question.store'), {
      onError: errors => {
        console.log(errors);
      },
      onSuccess: () => {
        console.log('success');
      },
    });
  }
  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('exercise-question.index')}
    >
      <Form form={form} submitTitle="Create" onSubmit={onSubmit} />
    </AdminFormLayout>
  );
}
