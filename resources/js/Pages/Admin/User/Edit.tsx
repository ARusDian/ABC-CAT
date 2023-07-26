import React from 'react';
import route from 'ziggy-js';

import AppLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { NewUser, Role } from '@/types';
import { Link } from '@inertiajs/react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';

interface Props {
  user: NewUser;
  roles: Array<Role>;
}

export default function Edit(props: Props) {
  let user = props.user;
  let form = useForm<NewUser>({
    defaultValues: user,
  });

  function onSubmit(e: NewUser) {
    Api.post(route('user.udpate', user.id), { ...e, _method: 'PUT' }, form);
  }

  return (
    <AdminFormLayout
      title="Edit User"
      backRoute={route('user.show', user.id)}
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
