import React from 'react';
import Select from 'react-select';

import InputError from '@/Components/Jetstream/InputError';
import TextInput from '@/Components/Jetstream/TextInput';
import { ErrorHelper } from '@/Models/ErrorHelper';
import { NewUser, Role } from '@/types';
import { InputLabel, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { asset } from '@/Models/Helper';
import { BaseDocumentFileModel, getStorageFileUrl } from '@/Models/FileModel';

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
        <InputLabel htmlFor="photo">Foto Profil</InputLabel>
        <Controller
          control={form.control}
          name="photo"
          render={({ field }) => {
            return (
              <div className='flex flex-col gap-3'>
                <img
                  className="rounded-full h-20 w-20 object-cover"
                  src={
                    form.getValues('photo')?.file ?
                      getStorageFileUrl(form.getValues('photo') as BaseDocumentFileModel)! :
                      (
                        form.formState.defaultValues?.profile_photo_path ? asset('public', form.formState.defaultValues?.profile_photo_path as string) : asset('root', 'assets/image/default-profile.png')
                      )
                  }
                  alt={form.formState.defaultValues?.name}
                />
                <input
                  type="file"
                  ref={field.ref}
                  onChange={e => {
                    field.onChange({
                      file: e.target.files![0],
                      path: "",
                      disk: 'public',
                    });
                  }}
                />
              </div>
            );
          }}
        />
        <InputError message={form.formState.errors.photo?.message} className="mt-2" />
      </div>
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
          label="Nomor Telepon"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.phone_number}
          error={form.formState.errors?.phone_number != null}
          helperText={form.formState.errors.phone_number?.message}
        />
      </div>
      <div className="form-control w-full mt-4">
        <Controller
          control={form.control}
          name='gender'
          render={({ field }) => {
            return (
              <>
                <InputLabel htmlFor="type">Gender</InputLabel>
                <ToggleButtonGroup
                  id="type"
                  color='primary'
                  value={field.value}
                  exclusive
                  onChange={(_e: React.MouseEvent<HTMLElement>, v: "L" | "P") =>
                    field.onChange(v)
                  }
                  aria-label="text alignment"
                >
                  <ToggleButton value="L" aria-label="left aligned">
                    Laki - laki
                  </ToggleButton>
                  <ToggleButton value="P" aria-label="centered">
                    Perempuan
                  </ToggleButton>
                </ToggleButtonGroup>
                <InputError className="mt-2" message={form.formState.errors.gender?.message} />
              </>
            )
          }}
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
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('address', {
            required: form.getValues('id') == null,
            minLength: { value: 8, message: 'address minimal 8 huruf' },
          })}
          label="Alamat"
          type="address"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.address}
          error={form.formState.errors?.address != null}
          helperText={form.formState.errors.address?.message}
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
