import { LearningPacketFormModel } from "@/Models/LearningPacket";
import { TextField } from "@mui/material";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<LearningPacketFormModel>
  className?: string
}

export default function Form({ form, className }: Props) {
  return (
    <div className={`flex-col gap-5 ${className}`}>
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
    </div>
  )
}
