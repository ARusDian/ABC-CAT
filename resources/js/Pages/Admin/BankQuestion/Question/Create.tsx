import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BankQuestionItemFormModel } from '@/Models/BankQuestionItem';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { Inertia } from '@inertiajs/inertia';

interface Props {
  bank_question: BankQuestionModel;
}

export default function Create(props: Props) {
  let form = useForm<BankQuestionItemFormModel>({
    defaultValues: {
    name: '',
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

  function onSubmit(e: BankQuestionItemFormModel) {
    console.log(e);
    form.clearErrors();

    Inertia.post(
      route('bank-question.item.store', [props.bank_question.id]),

      e as any,
      {
        onError: errors => {
          console.log(errors);
        },
      },
    );
  }

  return (
    <AdminFormLayout
      title="Tambah Pertanyaan"
      backRoute={route('bank-question.show', [props.bank_question.id])}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form
          form={form}
          className="my-5 mx-2"
          bankQuestionId={props.bank_question.id}
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
