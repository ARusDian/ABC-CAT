import { ExerciseQuestionFormModel } from '@/Models/ExerciseQuestion';
import { InertiaFormProps } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React from 'react';

interface Props {
  form: InertiaFormProps<ExerciseQuestionFormModel>;
  className?: string;
  onSubmit: (e: React.FormEvent) => any;
  submitTitle: string;
}

export default function Form({ form, submitTitle, onSubmit }: Props) {
  return (
    <form className="flex-col w-full space-y-5" onSubmit={onSubmit}>
      <TextField
        label="Nama"
        onChange={v => form.setData('name', v.target.value)}
        defaultValue={form.data.name}
        error={form.errors.name != null}
        helperText={form.errors.name}
        fullWidth
      />

      <Button type="submit" disabled={form.processing} fullWidth>
        {submitTitle}
      </Button>
    </form>
  );
}
