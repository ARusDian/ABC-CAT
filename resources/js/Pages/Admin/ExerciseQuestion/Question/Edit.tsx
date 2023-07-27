import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { useForm } from 'react-hook-form';

import Form from './Form';
import { QuestionFormModel, QuestionModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { router } from '@inertiajs/react';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  question: QuestionModel;
}

export default function Edit({ question }: Props) {
  let form = useForm<QuestionFormModel>({
    defaultValues: question,
  });

  function onSubmit(data: QuestionFormModel) {
    console.log(data);

    form.clearErrors();
    router.post(
      route('learning-packet.sub-learning-packet.learning-category.exercise-question.question.update', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        question.exercise_question_id,
        question.id,
      ]),
      {
        _method: 'PUT',
        ...data,
      } as any,
      {
        onError: errors => {
          console.log(errors);
        },
      },
    );
    // php does'nt support PUT so...
    // @ts-ignore
    // form.data._method = 'PUT';
    // form.post(route('question.update', question.id), {
    //   onError: errors => {
    //     console.log(errors);
    //   },
    //   onSuccess: () => {
    //     console.log('success');
    //   },
    // });
  }

  const {
    learning_packet,
    sub_learning_packet,
    learning_category,
  } = useDefaultClassificationRouteParams();

  return (
    <AdminFormLayout
      title="Edit Pertanyaan"
      backRoute={route('learning-packet.sub-learning-packet.learning-category.exercise-question.question.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        question.exercise_question_id,
        question.id,
      ])}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form
          form={form}
          className="my-5 mx-2"
          exerciseQuestionId={question.exercise_question_id}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            disabled={form.formState.isSubmitted}
          >
            Update
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
