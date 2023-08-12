import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import Select from 'react-select';

import InputError from '@/Components/Jetstream/InputError';
import { NewUser, Role } from '@/types';
import { Button, InputLabel, Modal, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { asset } from '@/Models/Helper';
import { BaseDocumentFileModel, getStorageFileUrl } from '@/Models/FileModel';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props extends React.HTMLAttributes<HTMLElement> {
  form: UseFormReturn<NewUser>;
  className?: string;
  roles: Array<Role>;
  isUpdate?: boolean;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  p: 4,
};

export default function Form(props: Props) {
  const { form, roles, isUpdate } = props;
  const [cropperModalOpen, setCropperModalOpen] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [cropper, setCropper] = useState<any>();

  const getNewImageUrl = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const getCropData = async () => {
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "newAvatar.png", { type: "image/png" });
        });
      if (file) {
        form.setValue('photo', {
          file: file,
          disk: 'public',
        });

        setCropperModalOpen(false);
      }
    } 
  };

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
                  accept="image/png, image/jpeg, image/jpg"
                  ref={field.ref}
                  onChange={e => {
                    getNewImageUrl(e);
                    setCropperModalOpen(true);
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
      <Modal
        open={cropperModalOpen}
        onClose={() => setCropperModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{ ...style }}>
          <div className='p-4 bg-white flex-col gap-5'>
            <Cropper
              src={image!}
              aspectRatio={1 / 1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              guides={false}
              checkOrientation={false}
              onInitialized={(instance) => {
                setCropper(instance);
              }}
            />
            <div className='flex justify-end mt-5'>
              <Button
                variant="contained"
                color="primary"
                onClick={getCropData}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div >
  );
}
