import React from 'react';
import route from 'ziggy-js';

import { NewUser, Role } from '@/types';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import { Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { LearningCategoryModel } from '@/Models/LearningCategory';

interface Props {
  user_data: NewUser;
  roles: Array<Role>;
  learning_categories: Array<LearningCategoryModel>;
}

export default function Edit(props: Props) {
  let user = props.user_data;
  let form = useForm<NewUser>({
    defaultValues: user,
  });

  async function onSubmit(value: any) {
    await Api.postAsync({
      route: route('user.update', user.id),
      value: {
        ...value,
        _method: 'PUT',
      },
      form,
    });
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
        <Form
          form={form}
          roles={props.roles}
          learningCategories={props.learning_categories}
          className="my-5 mx-2"
          isUpdate
        />
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
