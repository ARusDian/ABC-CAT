import React from 'react';
import route from 'ziggy-js';

import { useForm } from 'react-hook-form';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { router } from '@inertiajs/react';
import {
  BankQuestionItemFormModel,
  BankQuestionItemModel,
} from '@/Models/BankQuestionItem';
import Api from '@/Utils/Api';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  question: BankQuestionItemModel;
}

export default function Edit(props: Props) {
  const question = props.question;
  let form = useForm<BankQuestionItemFormModel>({
    defaultValues: question,
  });

  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();

  function onSubmit(data: BankQuestionItemFormModel) {
    Api.post(
      route('packet.sub.category.bank-question.item.update', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        question.bank_question_id,
        question.id,
      ]),
      {
        _method: 'PUT',
        ...data,
      },
      form,
    );
    // router.post(
    //   {
    //     _method: 'PUT',
    //     ...data,
    //   } as any,
    //   {
    //     onError: errors => {
    //       console.log(errors);
    //     },
    //   },
    // );
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
      backRoute={route('packet.sub.category.bank-question.item.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        question.bank_question_id,
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
          bankQuestionId={props.question.bank_question_id}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            disabled={form.formState.isSubmitting}
          >
            Update
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
