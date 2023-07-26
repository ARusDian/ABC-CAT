import React from 'react';
import route from 'ziggy-js';

import AppLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { NewUser, Role } from '@/types';
import { InertiaLink } from '@inertiajs/inertia-react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';
import _ from 'lodash';
import Api from '@/Utils/Api';

interface Props {
  roles: Array<Role>;
}

export default function Create(props: Props) {
  let form = useForm<NewUser>({
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      password: '',
      roles: [],
    },
  });

  function onSubmit(e: NewUser) {
    Api.post(route('user.store'), e, form);
  }

  return (
    <AdminFormLayout
      title="Tambah User"
      backRoute={route('user.index')}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Form form={form} roles={props.roles} className="my-5 mx-2" />
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
