import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import Radio from '@mui/material/Radio';
import TextEditorInput from '@/Components/TextEditorInput';
import {
  AnswerTypePilihanModel,
  BaseQuestionModel,
  QuestionFormModel,
  QuestionModel,
  QuestionPilihanFormModel,
} from '@/Models/Question';
import React, { useRef } from 'react';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import QuestionEditor from '@/Components/QuestionEditor';
import { Tab, Tabs } from '@mui/material';

interface Props {
  form: UseFormReturn<QuestionFormModel>;
  className?: string;

  exerciseQuestionId: string;
}

export type Test = {
  name: string;
};

function isQuestionPilihanFormModel(
  form: UseFormReturn<any>,
): form is UseFormReturn<QuestionPilihanFormModel> {
  return form.getValues('type') == 'Pilihan';
}
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
      {value === index && <div className="px-5">{children}</div>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
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
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Soal" {...a11yProps(0)} />
          <Tab label="Pilihan Jawaban" {...a11yProps(1)} />
          <Tab label="Penjelasan" {...a11yProps(2)} />
        </Tabs>
      </div>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('weight', { valueAsNumber: true })}
          type="number"
          inputProps={{ step: 'any' }}
          label="Bobot Soal"
          defaultValue={form.formState.defaultValues?.weight}
        />
        <CustomTabPanel value={tabValue} index={0}>
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
                    exerciseQuestionId={props.exerciseQuestionId}
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
            <PilihanForm
              form={form}
              exerciseQuestionId={props.exerciseQuestionId}
            />
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
                    exerciseQuestionId={props.exerciseQuestionId}
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

type QuestionFormPilihanModel = BaseQuestionModel & AnswerTypePilihanModel;

function PilihanForm({
  form,
  exerciseQuestionId,
}: {
  form: UseFormReturn<QuestionFormPilihanModel>;
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
          <React.Fragment key={it.id}>
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
          </React.Fragment>
        );
      })}
      <label>
        <InputLabel htmlFor="name">Jawaban Benar</InputLabel>
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
