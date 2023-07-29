import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import {
  BankQuestionFormModel,
  BankQuestionModel,
} from '@/Models/BankQuestion';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  bank_question: BankQuestionModel;
}

export default function Create({ bank_question }: Props) {
  let form = useForm<BankQuestionFormModel>({
    defaultValues: {
      name: bank_question.name,
      type: bank_question.type,
    },
  });

  const {
    learning_packet,
    sub_learning_packet,
    learning_category,
  } = useDefaultClassificationRouteParams();

  const onSubmit = React.useCallback(
    (e: BankQuestionFormModel) => {
      router.put(
        route('packet.packet.category.bank-question.update', [
          learning_packet,
          sub_learning_packet,
          learning_category,
          bank_question.id,
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
    [bank_question],
  );

  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('packet.packet.category.bank-question.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        bank_question.id,
      ])}
    >
      <Form
        form={form}
        submitTitle="Edit"
        onSubmit={form.handleSubmit(onSubmit)}
        isUpdate
      />
    </AdminFormLayout>
  );
}
