import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Link } from '@inertiajs/react';

import Form from './Form/Form';
import { BaseLearningMaterialModel } from '@/Models/LearningMaterial';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import useRoute from '@/Hooks/useRoute';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import Api from '@/Utils/Api';
import { useForm } from 'react-hook-form';

interface Props {}

export default function Create(props: Props) {
  let form = useForm<BaseLearningMaterialModel>({
    defaultValues: {
      title: '',
      description: {
        type: 'tiptap',
        content: {},
      },
      documents: [],
    },
  });

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  function onSubmit(e: BaseLearningMaterialModel) {
    Api.post(
      route('packet.sub.category.material.store', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
      ]),
      e,
      form,
    );
  }

  return (
    <AdminFormLayout
      title="Tambah Materi Belajar"
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
