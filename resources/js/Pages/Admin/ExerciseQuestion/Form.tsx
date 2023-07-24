import InputError from '@/Components/Jetstream/InputError';
import {
  DEFAULT_EXERCISE_QUESTION_TYPE,
  EXERCISE_QUESTION_TYPE,
  ExerciseQuestionFormModel,
} from '@/Models/ExerciseQuestion';
import { InertiaFormProps } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<ExerciseQuestionFormModel>;
  className?: string;
  onSubmit?: (e: React.FormEvent) => any;
  submitTitle?: string;
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
      <InputError message={form.formState.errors.name?.message} />

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
      <InputError message={form.formState.errors.time_limit?.message} />

      <FormControl fullWidth>
        <InputLabel>Tipe Soal</InputLabel>

        <Select
          defaultValue={form.formState.defaultValues?.type}
          label="Tipe Soal"
          {...form.register('type')}
        >
          {EXERCISE_QUESTION_TYPE.map(it => (
            <MenuItem key={it} value={it}>
              {it}
            </MenuItem>
          ))}
        </Select>
        <InputError message={form.formState.errors.type?.message} />
      </FormControl>

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
      <InputError message={form.formState.errors.number_of_question?.message} />

      {submitTitle != null ? (
        <Button type="submit" disabled={form.formState.isSubmitting} fullWidth>
          {submitTitle}
        </Button>
      ) : null}
    </form>
  );
}
