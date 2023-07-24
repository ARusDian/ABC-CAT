import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import Radio from '@mui/material/Radio';
import React from 'react';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import QuestionEditor from '@/Components/QuestionEditor';
import {
  BankQuestionItemFormModel,
  BankQuestionItemPilihanFormModel,
} from '@/Models/BankQuestionItem';
import { Tabs, Tab } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className='px-5'>
          {children}
        </div>

      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface Props {
  form: UseFormReturn<BankQuestionItemFormModel>;
  className?: string;

  bankQuestionId: string;
}

export type Test = {
  name: string;
};

function isQuestionPilihanFormModel(
  form: UseFormReturn<any>,
): form is UseFormReturn<BankQuestionItemPilihanFormModel> {
  return form.getValues('type') == 'Pilihan';
}

export default function Form(props: Props) {
  const form = props.form;

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className={`flex-col gap-5 ${props.className}`}>
      <div>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Soal" {...a11yProps(0)} />
          <Tab label="Pilihan Jawaban" {...a11yProps(1)} />
          <Tab label="Penjelasan" {...a11yProps(2)} />
        </Tabs>
      </div>
      <div className="form-control w-full mt-4">
        <CustomTabPanel value={tabValue} index={0}>
          <div className='flex gap-3'>
            <TextField
              {...form.register('name', { required: true })}
              label="Nama"
              defaultValue={form.formState.defaultValues?.name}
              error={form.formState.errors?.name != null}
              helperText={form.formState.errors?.name?.message}
            />

            <TextField
              {...form.register('weight', { valueAsNumber: true })}
              type="number"
              inputProps={{ step: 'any' }}
              label="Bobot Soal"
              defaultValue={form.formState.defaultValues?.weight}
              error={form.formState.errors?.weight != null}
              helperText={form.formState.errors?.weight?.message}
            />
          </div>
          <Controller
            name="question.content"
            control={form.control}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="name">Soal</InputLabel>
                  <QuestionEditor
                    content={field.value}
                    onBlur={field.onChange}
                    exerciseQuestionId={props.bankQuestionId}
                    editorClassName='h-full min-h-[96px] p-3'
                  />
                  <InputError
                    className="mt-2"
                    message={form.formState.errors.question?.message}
                  />
                </>
              );
            }}
          />
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          {isQuestionPilihanFormModel(form) ? (
            <PilihanForm form={form} exerciseQuestionId={props.bankQuestionId} />
          ) : null}
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={2}>
          <Controller
            name="explanation.content"
            control={form.control}
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="name">Penjelasan Jawaban</InputLabel>
                  <QuestionEditor
                    content={field.value}
                    onBlur={field.onChange}
                    exerciseQuestionId={props.bankQuestionId}
                    editorClassName='h-full min-h-[96px] p-3'
                  />
                  <InputError
                    className="mt-2"
                    message={form.formState.errors.question?.message}
                  />
                </>
              );
            }}
          />
        </CustomTabPanel>
      </div>
    </div>
  );
}

function PilihanForm({
  form,
  exerciseQuestionId,
}: {
  form: UseFormReturn<BankQuestionItemPilihanFormModel>;
  exerciseQuestionId: string;
}) {
  const answerArray = useFieldArray({
    name: 'answers.choices',
    control: form.control,
  });

  return (
    <>
      {answerArray.fields.map((it, index) => {
        return (
          <div key={it.id} className='border-b py-3'>
            <Controller
              name={`answers.choices.${index}.content`}
              control={form.control}
              render={({ field }) => {
                return (
                  <>
                    <InputLabel htmlFor="name">Jawaban {index + 1}</InputLabel>
                    <QuestionEditor
                      content={field.value}
                      onBlur={field.onChange}
                      exerciseQuestionId={exerciseQuestionId}
                      editorClassName='h-full min-h-[96px] p-3'
                    />
                    <InputError
                      className="mt-2"
                      message={
                        form.formState.errors?.answers?.choices?.at?.(index)
                          ?.message
                      }
                    />
                  </>
                );
              }}
            />
          </div>
        );
      })}
      <label className='text-lg font-semibold'>
        <InputLabel htmlFor="name">Pilihan Jawaban Benar</InputLabel>
      </label>
      <RadioGroup defaultValue={form.formState.defaultValues?.answer}>
        {answerArray.fields.map((it, index) => {
          return (
            <Controller
              name="answer"
              control={form.control}
              key={it.id}
              render={({ field }) => {
                return (
                  <FormControlLabel
                    value={index}
                    control={
                      <Radio
                        ref={field.ref}
                        onChange={() => field.onChange(index)}
                        onBlur={field.onBlur}
                      />
                    }
                    label={`Jawaban ${index + 1}`}
                  />
                );
              }}
            />
          );
        })}
      </RadioGroup>
    </>
  );
}
