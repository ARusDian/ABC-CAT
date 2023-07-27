import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Link, useForm } from '@inertiajs/react';

import Form from './Form/Form';
import { BaseLearningMaterialModel } from '@/Models/LearningMaterial';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import useRoute from '@/Hooks/useRoute';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';

interface Props { }

export default function Create(props: Props) {
  let form = useForm<BaseLearningMaterialModel>({
    title: '',
    description: '',
    documents: [],
  });

  const { learning_packet, sub_learning_packet, learning_category } = useDefaultClassificationRouteParams();

  function onSubmit(e: React.FormEvent) {
    console.log(form.data);
    e.preventDefault();
    form.clearErrors();
    form.post(route('learning-packet.sub-learning-packet.learning-category.learning-material.store', [
      learning_packet,
      sub_learning_packet,
      learning_category,
    ]), {
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
      title="Tambah Materi Belajar"
      backRoute={route('learning-packet.sub-learning-packet.learning-category.show', [
        learning_packet,
        sub_learning_packet,
        learning_category
      ])}
      backRouteTitle="Kembali"
    >
      <form className="flex-col gap-5 py-5" onSubmit={onSubmit}>
        <Form form={form} className="my-5 mx-2" />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={form.processing}
          >
            Submit
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
