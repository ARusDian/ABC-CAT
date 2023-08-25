import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Link } from '@inertiajs/react';

import Form from './Form/Form';
import {
  BaseLearningMaterialModel,
  LearningMaterialModel,
} from '@/Models/LearningMaterial';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';

interface Props {
  learning_material: LearningMaterialModel;
}

export default function Edit(props: Props) {
  const learningMaterial = props.learning_material;
  console.log(props);
  let form = useForm<BaseLearningMaterialModel>({
    defaultValues: learningMaterial,
  });

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('packet.sub.category.material.update', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        learningMaterial.id,
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
      title="Edit Materi Belajar"
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
