import React from 'react';
import route from 'ziggy-js';

import { useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import {
  ExerciseQuestionFormModel,
  ExerciseQuestionModel,
} from '@/Models/ExerciseQuestion';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Create(props: Props) {
  let form = useForm<ExerciseQuestionFormModel>({
    name: props.exercise_question.name,
  });

  const onSubmit = React.useCallback(
    (e: React.FormEvent) => {
      console.log(form.data);
      e.preventDefault();
      form.clearErrors();
      form.put(route('exercise-question.update', props.exercise_question.id), {
        onError: errors => {
          console.log(errors);
        },
        onSuccess: () => {
          console.log('success');
        },
      });
    },
    [props.exercise_question],
  );

  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('exercise-question.show', props.exercise_question.id)}
    >
      <Form form={form} submitTitle="Edit" onSubmit={onSubmit} />
    </AdminFormLayout>
  );
}
