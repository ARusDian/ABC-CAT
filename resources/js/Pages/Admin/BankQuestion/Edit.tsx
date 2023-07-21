import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';
import { BankQuestionFormModel, BankQuestionModel } from '@/Models/BankQuestion';

interface Props {
  bank_question: BankQuestionModel;
}

export default function Create(props: Props) {
  let form = useForm<BankQuestionFormModel>({
    defaultValues: {
      name: props.bank_question.name,
      type: props.bank_question.type,
    },
  });

  const onSubmit = React.useCallback(
    (e: BankQuestionFormModel) => {
      Inertia.put(
        route('bank-question.update', props.bank_question.id),
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
    [props.bank_question],
  );

  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('bank-question.show', props.bank_question.id)}
    >
      <Form
        form={form}
        submitTitle="Edit"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </AdminFormLayout>
  );
}
