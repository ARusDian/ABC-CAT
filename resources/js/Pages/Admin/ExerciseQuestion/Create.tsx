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
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import { Button } from '@mui/material';

interface Props {}

export default function Create(props: Props) {
  let form = useDefaultExerciseQuestionFormModel();

  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();

  function onSubmit(e: ExerciseQuestionFormModel) {
    router.post(
      route('packet.sub.category.exercise.store', [
        learning_packet,
        sub_learning_packet,
        learning_category,
      ]),
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
  }
  return (
    <AdminFormLayout
      title="Tambah Latihan Soal"
      backRoute={route('packet.sub.category.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
      ])}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-col space-y-5 w-full"
      >
        <Form form={form} />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          fullWidth
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </form>
    </AdminFormLayout>
  );
}
