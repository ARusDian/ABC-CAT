import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import {
  LearningPacketFormModel,
  LearningPacketModel,
} from '@/Models/LearningPacket';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import route from 'ziggy-js';
import Form from './Form';

interface Props {
  learning_packet: LearningPacketModel;
}

export default function Edit({ learning_packet }: Props) {
  let form = useForm<LearningPacketFormModel>({
    defaultValues: learning_packet,
  });

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('packet.update', learning_packet.id),
      value: { ...value, _method: 'PUT' },
      form,
    });
  }

  return (
    <AdminFormLayout
      title="Edit Paket Belajar"
      backRoute={route('packet.show', learning_packet.id)}
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
