import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Link, useForm } from '@inertiajs/react';

import Form from './Form/Form';
import {
  BaseLearningMaterialModel,
  LearningMaterialModel,
} from '@/Models/LearningMaterial';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';

interface Props {
  learningMaterial: LearningMaterialModel;
}

export default function Edit(props: Props) {
  const learningMaterial = props.learningMaterial;
  console.log(props);
  let form = useForm<BaseLearningMaterialModel>(learningMaterial);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    form.clearErrors();
    // php does'nt support PUT so...
    // @ts-ignore
    form.data._method = 'PUT';
    form.post(route('learning-material.update', learningMaterial.id), {
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
      title="Edit Materi Belajar"
      backRoute={route('learning-material.show', learningMaterial.id)}
      backRouteTitle="Kembali"
    >
      <form className="flex-col gap-5 py-5" onSubmit={onSubmit}>
        <Form form={form} className="my-5 mx-2" />
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="warning"
            size="large"
            disabled={form.processing}
          >
            Update
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
