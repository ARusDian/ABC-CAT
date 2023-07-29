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
  learningMaterial: LearningMaterialModel;
}

export default function Edit(props: Props) {
  const learningMaterial = props.learningMaterial;
  console.log(props);
  let form = useForm<BaseLearningMaterialModel>({
    defaultValues: learningMaterial,
  });

  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();

  function onSubmit(e: BaseLearningMaterialModel) {
    Api.post(

      route('packet.sub.category.material.update',
        [
          learning_packet,
          sub_learning_packet,
          learning_category,
          learningMaterial.id,
        ],
      ),
      {
        ...e,
        _method: 'PUT'
      },
      form
    )
  }

  return (
    <AdminFormLayout
      title="Edit Materi Belajar"
      backRoute={route('packet.sub.category.show',
        [learning_packet, sub_learning_packet, learning_category],
      )}
      backRouteTitle="Kembali"
    >
      <form className="flex-col gap-5 py-5" onSubmit={form.handleSubmit(onSubmit)}>
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
