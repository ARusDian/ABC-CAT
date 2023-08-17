import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import { getStorageFileUrl, BaseDocumentFileModel } from '@/Models/FileModel';
import { asset } from '@/Models/Helper';
import { LearningPacketFormModel } from '@/Models/LearningPacket';
import { Button, Modal, TextField } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Props {
  form: UseFormReturn<LearningPacketFormModel>;
  className?: string;
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

export default function Form({ form, className }: Props) {
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
        .then(res => res.blob())
        .then(blob => {
          return new File([blob], 'newAvatar.png', { type: 'image/png' });
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
    <div className={`flex-col gap-5 ${className}`}>
      <div className="form-control w-full mt-4">
        <InputLabel htmlFor="photo">Foto
        </InputLabel>
        <Controller
          control={form.control}
          name="photo"
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-3">
                <img
                  className="h-20 w-20 object-cover mx-auto"
                  src={
                    form.getValues('photo')?.file
                      ? getStorageFileUrl(
                        form.getValues('photo') as BaseDocumentFileModel,
                      )!
                      : form.formState.defaultValues?.photo_path
                        ? asset(
                          'public',
                          form.formState.defaultValues
                            ?.photo_path as string,
                        )
                        : asset('root', 'assets/image/default-image.jpg')
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
        <InputError
          message={form.formState.errors.photo?.message}
          className="mt-2"
        />
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
          {...form.register('description', { required: true })}
          label="Deskripsi"
          className="mt-1 block w-full"
          defaultValue={form.formState.defaultValues?.description}
          error={form.formState.errors?.description != null}
          helperText={form.formState.errors.description?.message}
        />
      </div>
      <Modal
        open={cropperModalOpen}
        onClose={() => setCropperModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div style={{ ...style }}>
          <div className="p-4 bg-white flex-col gap-5">
            <Cropper
              src={image!}
              aspectRatio={1 / 1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              guides={false}
              checkOrientation={false}
              onInitialized={instance => {
                setCropper(instance);
              }}
            />
            <div className="flex justify-end mt-5">
              <Button variant="contained" color="primary" onClick={getCropData}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
