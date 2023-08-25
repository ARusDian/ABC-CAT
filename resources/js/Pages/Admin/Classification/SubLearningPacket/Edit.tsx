import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import route from 'ziggy-js';
import Form from './Form';
import {
  SubLearningPacketFormModel,
  SubLearningPacketModel,
} from '@/Models/SubLearningPacket';

interface Props {
  sub_learning_packet: SubLearningPacketModel;
}

export default function Edit({ sub_learning_packet }: Props) {
  let form = useForm<SubLearningPacketFormModel>({
    defaultValues: sub_learning_packet,
  });

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('packet.sub.update', {
        learning_packet: sub_learning_packet.learning_packet_id,
        sub_learning_packet: sub_learning_packet.id,
      }),
      value: { ...value, _method: 'PUT' },
      form,
    });
  }

  return (
    <AdminFormLayout
      title="Edit Sub Paket Belajar"
      backRoute={route('packet.sub.show', {
        learning_packet: sub_learning_packet.learning_packet_id,
        sub_learning_packet: sub_learning_packet.id,
      })}
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
