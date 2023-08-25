import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import route from 'ziggy-js';
import Form from './Form';
import {
  LearningCategoryModel,
  LearningCategoryFormModel,
} from '@/Models/LearningCategory';
import { usePage } from '@inertiajs/react';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props {
  learning_category: LearningCategoryModel;
}

export default function Edit({ learning_category }: Props) {
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  let form = useForm<LearningCategoryFormModel>({
    defaultValues: learning_category,
  });

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('packet.sub.category.update', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        learning_category.id,
      ]),
      value: {
        ...value,
        _method: 'PUT',
      },
      form,
    });
  }

  return (
    <AdminFormLayout
      title="Edit Kategori Belajar"
      backRoute={route('packet.sub.category.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
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
