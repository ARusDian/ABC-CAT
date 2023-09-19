import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BankQuestionItemFormModel } from '@/Models/BankQuestionItem';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { router } from '@inertiajs/react';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  bank_question: BankQuestionModel;
}

function defaultAnswer(
  bank_question: BankQuestionModel,
): BankQuestionItemFormModel['answer'] {
  if (bank_question.type == 'Kepribadian') {
    return {
      type: 'WeightedChoice',
      answer: [0, 0, 0, 0, 0].map(it => ({ weight: it })),
    };
  } else {
    return {
      type: 'Single',
      answer: 0,
    };
  }
}

export default function Create({ bank_question }: Props) {
  let form = useForm<BankQuestionItemFormModel>({
    defaultValues: {
      name: '',
      question: {
        type: 'tiptap',
        content: {},
      },
      type: 'Pilihan',
      answer: defaultAnswer(bank_question),
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

  function onSubmit(e: BankQuestionItemFormModel) {
    console.log(e);
    form.clearErrors();

    router.post(
      route('packet.sub.category.bank-question.item.store', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        bank_question.id,
      ]),

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
      backRoute={route('packet.sub.category.bank-question.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        bank_question.id,
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
          bankQuestionId={bank_question.id}
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
