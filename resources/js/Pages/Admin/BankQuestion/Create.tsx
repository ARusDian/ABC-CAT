import React from 'react';
import route from 'ziggy-js';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import {
  BankQuestionFormModel,
  DEFAULT_BANK_QUESTION_TYPE,
} from '@/Models/BankQuestion';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props { }

export default function Create(props: Props) {
  let form = useForm<BankQuestionFormModel>({
    defaultValues: {
      name: '',
      type: DEFAULT_BANK_QUESTION_TYPE,
    },
  });

  const {
    learning_packet_id,
    sub_learning_packet_id,
    learning_category_id
  } =
    useDefaultClassificationRouteParams();

  function onSubmit(e: BankQuestionFormModel) {
    router.post(
      route('packet.sub.category.bank-question.store', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
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
  }
  return (
    <AdminFormLayout
      title="Tambah Soal Latihan"
      backRoute={route('packet.sub.category.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
      ])}
    >
      <Form
        form={form}
        submitTitle="Create"
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </AdminFormLayout>
  );
}
