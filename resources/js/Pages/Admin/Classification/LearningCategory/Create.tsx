import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import route from 'ziggy-js';
import Form from './Form';
import { LearningCategoryFormModel } from '@/Models/LearningCategory';

interface Props {
  learning_packet_id: number;
  sub_learning_packet_id: number;
}

export default function Create({
  learning_packet_id,
  sub_learning_packet_id,
}: Props) {
  let form = useForm<LearningCategoryFormModel>({
    defaultValues: {
      name: '',
      sub_learning_packet_id: sub_learning_packet_id,
    },
  });

  function onSubmit(e: LearningCategoryFormModel) {
    Api.post(
      route('packet.sub.category.store', [
        learning_packet_id,
        sub_learning_packet_id,
      ]),
      e,
      form,
    );
  }

  return (
    <AdminFormLayout
      title="Tambah Kategori Belajar"
      backRoute={route('packet.sub.show', [
        learning_packet_id,
        sub_learning_packet_id,
      ])}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form form={form} className="my-5 mx-2" />
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
