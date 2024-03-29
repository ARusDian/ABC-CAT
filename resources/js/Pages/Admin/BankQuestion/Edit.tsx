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

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  const onSubmit = React.useCallback(
    (e: BankQuestionFormModel) => {
      router.put(
        route('packet.sub.category.bank-question.update', [
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
      title="Edit Bank Soal"
      backRoute={route('packet.sub.category.bank-question.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
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
