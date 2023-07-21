import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';
import { BankQuestionFormModel, DEFAULT_BANK_QUESTION_TYPE } from '@/Models/BankQuestion';

interface Props {}

export default function Create(props: Props) {
  let form = useForm<BankQuestionFormModel>({
    defaultValues: {
      name: '',
      type: DEFAULT_BANK_QUESTION_TYPE,
    },
  });

  function onSubmit(e: BankQuestionFormModel) {
    Inertia.post(route('bank-question.store'), e as any, {
      onError: errors => {
        console.log(errors);
      },
      onSuccess: () => {
        console.log('success');
      },
    });
  }
  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('bank-question.index')}
    >
      <Form
        form={form}
        submitTitle="Create"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </AdminFormLayout>
  );
}
