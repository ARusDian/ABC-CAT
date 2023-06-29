import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import Radio from '@mui/material/Radio';
import TextEditorInput from '@/Components/TextEditorInput';
import {
  AnswerTypePilihanModel,
  BaseQuestionModel,
  QuestionFormModel,
  QuestionModel,
} from '@/Models/Question';
import React, { useRef } from 'react';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import QuestionEditor from '@/Components/QuestionEditor';

interface Props {
  form: UseFormReturn<QuestionFormModel>;
  className?: string;

  exerciseQuestionId: string;
}

export type Test = {
  name: string;
};

export default function Form(props: Props) {
  const form = props.form;

  return (
    <div className={`flex-col gap-5 ${props.className}`}>
      <div className="form-control w-full mt-4">
        <TextField
          {...form.register('weight', { valueAsNumber: true })}
          type="number"
          inputProps={{ step: 'any' }}
          label="Bobot Soal"
          defaultValue={form.formState.defaultValues?.weight}
        />

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

        {form.getValues('type') == 'pilihan' ? (
          <PilihanForm
            form={form}
            exerciseQuestionId={props.exerciseQuestionId}
          />
        ) : null}
      </div>
    </div>
  );
}

type QuestionFormPilihanModel = QuestionModel & AnswerTypePilihanModel;

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
