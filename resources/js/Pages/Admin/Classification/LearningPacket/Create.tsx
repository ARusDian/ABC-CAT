import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { LearningPacketFormModel } from '@/Models/LearningPacket';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Props } from 'react-select';
import route from 'ziggy-js';
import Form from './Form';

export default function Create(props: Props) {
  let form = useForm<LearningPacketFormModel>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(e: LearningPacketFormModel) {
    Api.post(route('packet.store'), e, form);
  }

  return (
    <AdminFormLayout
      title="Tambah Paket Belajar"
      backRoute={route('packet.index')}
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
