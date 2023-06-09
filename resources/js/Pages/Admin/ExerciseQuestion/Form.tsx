import { ExerciseQuestionFormModel } from '@/Models/ExerciseQuestion';
import { InertiaFormProps } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<ExerciseQuestionFormModel>;
  className?: string;
  onSubmit: (e: React.FormEvent) => any;
  submitTitle: string;
}

export default function Form({ form, submitTitle, onSubmit }: Props) {
  return (
    <form className="flex-col w-full space-y-5" onSubmit={onSubmit}>
      <TextField
        label="Nama"
        {...form.register('name')}
        // onChange={form.register}
        defaultValue={form.formState.defaultValues?.name}
        error={form.formState.errors.name != null}
        helperText={form.formState.errors.name?.message}
        fullWidth
      />

      <TextField
        label="Batas Waktu (Menit)"
        type="number"
        {...form.register('time_limit', {
          valueAsNumber: true,
        })}
        defaultValue={form.formState.defaultValues?.time_limit}
        error={form.formState.errors.time_limit != null}
        helperText={form.formState.errors.time_limit?.message}
        fullWidth
      />

      <TextField
        label="Jumlah Soal"
        type="number"
        {...form.register('number_of_question', {
          valueAsNumber: true,
        })}
        defaultValue={form.formState.defaultValues?.number_of_question}
        error={form.formState.errors.number_of_question != null}
        helperText={form.formState.errors.number_of_question?.message}
        fullWidth
      />

      <Button type="submit" disabled={form.formState.isSubmitting} fullWidth>
        {submitTitle}
      </Button>
    </form>
  );
}
