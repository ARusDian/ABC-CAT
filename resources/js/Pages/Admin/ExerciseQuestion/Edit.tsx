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
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import { Button } from '@mui/material';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Create({ exercise_question }: Props) {
  let form = useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: exercise_question.name,
      time_limit: exercise_question.time_limit,
      number_of_question: exercise_question.number_of_question,
      type: exercise_question.type,
    },
  });

  const {
    learning_packet_id,
    sub_learning_packet_id,
    learning_category_id
  } =
    useDefaultClassificationRouteParams();

  const onSubmit = React.useCallback(
    (e: ExerciseQuestionFormModel) => {
      router.put(
        route('packet.sub.category.exercise.update', [
          learning_packet_id,
          sub_learning_packet_id,
          learning_category_id,
          exercise_question.id,
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
    },
    [exercise_question],
  );

  return (
    <AdminFormLayout
      title="Edit Latihan Soal"
      backRoute={route('packet.sub.category.exercise.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exercise_question.id,
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
          color="warning"
        >
          Submit
        </Button>
      </form>
    </AdminFormLayout>
  );
}
