import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink, useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import { BaseQuestionModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/AdminFormLayout';
import { Button } from '@mui/material';

interface Props {}

export default function Create(props: Props) {
  let form = useForm<BaseQuestionModel>({
    content: '',
    images: [],
  });

  function onSubmit(e: React.FormEvent) {
    console.log(form.data);
    e.preventDefault();
    form.clearErrors();
    form.post(route('question.store'), {
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
      title="Tambah Pertanyaan"
      backRoute={route('question.index')}
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
