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

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  function onSubmit(data: QuestionFormModel) {
    console.log(data);

    form.clearErrors();
    router.post(
      route('packet.sub.category.exercise.question.update', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
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

  return (
    <AdminFormLayout
      title="Edit Pertanyaan"
      backRoute={route('packet.sub.category.exercise.question.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
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
