import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';

import Form from './Form';
import { BaseQuestionModel, QuestionFormModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Create(props: Props) {
  let form = useForm<QuestionFormModel>({
    defaultValues: {
      content: '',
      images: [],
      weight: 1,
      type: 'pilihan',
      time_limit: 120,
      answers: {
        right_answer: 0,
        choices: [
          { content: '', images: [] },
          { content: '', images: [] },
          { content: '', images: [] },
          { content: '', images: [] },
        ],
      },
    },
  });

  function onSubmit(e: QuestionFormModel) {
    console.log(e);
    form.clearErrors();
    Inertia.post(
      route('exercise-question.question.store', props.exercise_question.id),
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
      title="Tambah Pertanyaan"
      backRoute={route('question.index')}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form form={form} className="my-5 mx-2" />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
