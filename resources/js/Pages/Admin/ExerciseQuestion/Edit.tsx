import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import {
  ExerciseQuestionFormModel,
  ExerciseQuestionModel,
} from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Create(props: Props) {
  let form = useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: props.exercise_question.name,
      time_limit: props.exercise_question.time_limit,
      number_of_question: props.exercise_question.number_of_question,
    },
  });

  const onSubmit = React.useCallback(
    (e: ExerciseQuestionFormModel) => {
      router.put(
        route('exercise-question.update', props.exercise_question.id),
        e as any,
        {
          onError: errors => {
            console.log(errors);
          },
          onSuccess: () => {
            console.log('success');
          },
        },
      );
    },
    [props.exercise_question],
  );

  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('exercise-question.show', props.exercise_question.id)}
    >
      <Form
        form={form}
        submitTitle="Edit"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </AdminFormLayout>
  );
}
