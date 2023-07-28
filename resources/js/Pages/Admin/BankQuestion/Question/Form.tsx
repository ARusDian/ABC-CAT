import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import Radio from '@mui/material/Radio';
import React from 'react';
import { Controller, UseFormReturn, useFieldArray, useWatch } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import QuestionEditor from '@/Components/QuestionEditor';
import {
  AnswerWeightedChoiceVariant,
  BankQuestionItemFormModel,
  BankQuestionItemModel,
  BankQuestionItemPilihanFormModel,
} from '@/Models/BankQuestionItem';
import { Tabs, Tab, Checkbox, Select, MenuItem } from '@mui/material';

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

function isWeightedChoiceFormModel(
  form: UseFormReturn<any>,
): form is UseFormReturn<
  BankQuestionItemModel & { answer: AnswerWeightedChoiceVariant }
> {
  return form.getValues('answer.type') == 'WeightedChoice';
}

export default function Form(props: Props) {
  const form = props.form;

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const answerType = useWatch({
    control: form.control,
    name: 'answer.type',
  });

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
          <div className="flex gap-3">
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

            <Select
              value={answerType}
              onChange={e => {
                const value = e.target.value;

                if (value == 'Single') {
                  form.setValue('answer', { type: 'Single', answer: 0 });
                } else if (value == 'WeightedChoice') {
                  form.setValue('answer', {
                    type: 'WeightedChoice',
                    answer: form
                      .getValues('answers')
                      .choices.map(it => ({ weight: 0 })),
                  });
                }
              }}
            >
              {Object.entries({
                Single: 'Tidak Berbobot',
                WeightedChoice: 'Berbobot',
              }).map(([key, value]) => {
                return <MenuItem value={key}>{value}</MenuItem>;
              })}
            </Select>
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
                    editorClassName="h-full min-h-[96px] p-3"
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
              exerciseQuestionId={props.bankQuestionId}
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
                    exerciseQuestionId={props.bankQuestionId}
                    editorClassName="h-full min-h-[96px] p-3"
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
  const choicesArray = useFieldArray({
    name: 'answers.choices',
    control: form.control,
  });

  return (
    <>
      {choicesArray.fields.map((it, index) => {
        return (
          <div key={it.id} className="border-b py-3 flex flex-col gap-3">
            <Controller
              name={`answers.choices.${index}.content`}
              control={form.control}
              render={({ field }) => {
                const weightIndex =
                  `answer.answer.${index}.weight` as 'answer.answer.0.weight';

                return (
                  <>
                    <InputLabel htmlFor="name">Jawaban {index + 1}</InputLabel>
                    <QuestionEditor
                      content={field.value}
                      onBlur={field.onChange}
                      exerciseQuestionId={exerciseQuestionId}
                      editorClassName="h-full min-h-[96px] p-3"
                    />
                    <InputError
                      className="mt-2"
                      message={
                        form.formState.errors?.answers?.choices?.at?.(index)
                          ?.message
                      }
                    />
                    {isWeightedChoiceFormModel(form) ? (
                      <>
                        <TextField
                          label="Bobot"
                          type="number"
                          error={
                            form.formState.errors.answer?.answer?.[index]
                              ?.weight != null
                          }
                          helperText={
                            form.formState.errors.answer?.answer?.[index]
                              ?.weight?.message
                          }
                          // defaultValue={form.formState.defaultValues.answer.answer[index].weight}
                          {...form.register(
                            `answer.answer.${index}.weight` as 'answer.answer.0.weight',
                            {
                              max: {
                                message: 'Bobot harus diantara 0 dan 1',
                                value: 1,
                              },
                              min: {
                                message: 'Bobot harus diantara 0 dan 1',
                                value: 0,
                              },
                              valueAsNumber: true,
                              validate: value => value >= 0 && value <= 1,
                              // pattern: {
                              //   value: /^(0|[1-9]\d*)(\.\d+)?$/,
                              // },
                            },
                          )}
                        />
                      </>
                    ) : null}
                  </>
                );
              }}
            />
          </div>
        );
      })}
      {form.getValues('answer.type') == 'Single' ? (
        <>
          <label className="text-lg font-semibold">
            <InputLabel htmlFor="name">Pilihan Jawaban Benar</InputLabel>
          </label>
          <RadioGroup defaultValue={form.formState.defaultValues?.answer}>
            {choicesArray.fields.map((it, index) => {
              return (
                <Controller
                  name="answer.answer"
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
      ) : null}
    </>
  );
}
