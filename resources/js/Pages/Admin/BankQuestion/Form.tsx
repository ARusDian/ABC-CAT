import {
  BANK_QUESTION_TYPE,
  BankQuestionFormModel,
} from '@/Models/BankQuestion';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';

interface Props {
  form: UseFormReturn<BankQuestionFormModel>;
  className?: string;
  onSubmit: (e: React.FormEvent) => any;
  submitTitle: string;
  isUpdate?: boolean;
}

export default function Form({
  form,
  submitTitle,
  onSubmit,
  isUpdate = false,
}: Props) {
  return (
    <form className="flex-col w-full space-y-5" onSubmit={onSubmit}>
      <TextField
        label="Nama"
        {...form.register('name', {
          required: true,
        })}
        variant="outlined"
        // onChange={form.register}
        defaultValue={form.formState.defaultValues?.name}
        error={form.formState.errors.name != null}
        helperText={form.formState.errors.name?.message}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Tipe Soal</InputLabel>

        <Select
          defaultValue={form.formState.defaultValues?.type}
          label="Tipe Soal"
          {...form.register('type')}
        >
          {BANK_QUESTION_TYPE.map(it => (
            <MenuItem key={it} value={it}>
              {it}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          variant="contained"
          size="large"
          color={isUpdate ? 'warning' : 'primary'}
        >
          {submitTitle}
        </Button>
      </div>
    </form>
  );
}
