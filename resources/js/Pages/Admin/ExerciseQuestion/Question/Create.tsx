import React from 'react';
import route from 'ziggy-js';
import Form from './Form';
import { QuestionFormModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Create({ exercise_question }: Props) {
  let form = useForm<QuestionFormModel>({
    defaultValues: {
      question: {
        type: 'tiptap',
        content: {},
      },
      weight: 1,
      type: 'Pilihan',
      answer: 0,
      answers: {
        choices: [
          {
            type: 'tiptap',
            content: {},
          },
          {
            type: 'tiptap',
            content: {},
          },
          {
            type: 'tiptap',
            content: {},
          },
          {
            type: 'tiptap',
            content: {},
          },
          {
            type: 'tiptap',
            content: {},
          },
        ],
      },
      explanation: {
        type: 'tiptap',
        content: {},
      },
    },
  });

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  function onSubmit(e: QuestionFormModel) {
    console.log(e);
    form.clearErrors();
  }

  return (
    <AdminFormLayout
      title="Tambah Pertanyaan"
      backRoute={route('packet.sub.category.exercise.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exercise_question.id,
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
          exerciseQuestionId={exercise_question.id}
        />
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
