import React from 'react';
import Select from 'react-select';

import InputError from '@/Components/Jetstream/InputError';
import TextInput from '@/Components/Jetstream/TextInput';
import { ErrorHelper } from '@/Models/ErrorHelper';
import { NewUser, Role } from '@/types';
import { InputLabel, TextField } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';

interface Props extends React.HTMLAttributes<HTMLElement> {
  form: UseFormReturn<NewUser>;
  className?: string;
  roles: Array<Role>;
  isUpdate?: boolean;
}

export default function Form(props: Props) {
  const { form, roles, isUpdate } = props;

  return (
    <div className={`flex-col gap-5 ${props.className}`}>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('name', { required: true })}
          label="Nama"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.name}
          error={form.formState.errors?.name != null}
          helperText={form.formState.errors.name?.message}
        />
      </div>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('email', { required: true })}
          label="Email"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.email}
          error={form.formState.errors?.email != null}
          helperText={form.formState.errors.email?.message}
        />
      </div>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('phone_number', { required: true })}
          label="Phone Number"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.phone_number}
          error={form.formState.errors?.phone_number != null}
          helperText={form.formState.errors.phone_number?.message}
        />
      </div>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('password', {
            required: form.getValues('id') == null,
            minLength: { value: 8, message: 'Password minimal 8 huruf' },
          })}
          label="Password"
          type="password"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.password}
          error={form.formState.errors?.password != null}
          helperText={form.formState.errors.password?.message}
        />
      </div>
      {
        isUpdate && (
          <div className="form-control w-full mt-4">
            <TextField
              type="number" placeholder="YYYY" min="1999" max={9999}
              label="Tahun Aktif"
              {...form.register('active_year', { required: true })}
              className="mt-1 block w-full"
              defaultValue={form.formState.defaultValues?.active_year}
              error={form.formState.errors?.active_year != null}
              helperText={form.formState.errors.active_year?.message}
            />
          </div>
        )
      }
      <div className="form-control w-full mt-4 z-50">
        <Controller
          control={form.control}
          name="roles"
          render={({ field }) => {
            return (
              <>
                <InputLabel htmlFor="roles">Role</InputLabel>
                <Select
                  ref={field.ref}
                  isMulti
                  options={roles}
                  getOptionValue={it => it.id!.toString()}
                  getOptionLabel={it => it.name}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value.slice());
                  }}
                />
                <InputError
                  message={form.formState.errors.roles?.message}
                  className="mt-2"
                />
              </>
            );
          }}
        />
      </div>
    </div>
  );
}
