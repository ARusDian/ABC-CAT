import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import {
  DEFAULT_EXERCISE_QUESTION_TYPE,
  ExerciseQuestionFormModel,
} from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import { useDefaultExerciseQuestionFormModel } from '@/Hooks/useDefaultExerciseQuestionForm';

interface Props {}

export default function Create(props: Props) {
  let form = useDefaultExerciseQuestionFormModel();

  function onSubmit(e: ExerciseQuestionFormModel) {
    router.post(route('exercise-question.store'), e as any, {
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
