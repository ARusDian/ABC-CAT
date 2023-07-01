import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { ExerciseQuestionFormModel } from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';

interface Props {}

export default function Create(props: Props) {
  let form = useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: '',
      time_limit: 120,
      number_of_question: 50,
    },
  });

  function onSubmit(e: ExerciseQuestionFormModel) {
    Inertia.post(route('exercise-question.store'), e as any, {
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
      <Form
        form={form}
        submitTitle="Create"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </AdminFormLayout>
  );
}
