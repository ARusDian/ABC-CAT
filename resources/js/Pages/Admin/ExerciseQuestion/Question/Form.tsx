import InputError from '@/Components/Jetstream/InputError';
import InputLabel from '@/Components/Jetstream/InputLabel';
import Radio from '@mui/material/Radio';
import TextEditorInput from '@/Components/TextEditorInput';
import {
  AnswerTypePilihanFormModel,
  BaseQuestionModel,
  QuestionFormModel,
} from '@/Models/Question';
import { InertiaFormProps } from '@inertiajs/inertia-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

interface Props {
  form: UseFormReturn<QuestionFormModel>;
  className?: string;
}

export type Test = {
    name: string;
}

export default function Form(props: Props) {
  const form = props.form;
  const editorRef = useRef();

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
          name="content"
          control={form.control}
          render={({ field }) => {
            return (
              <>
                <InputLabel htmlFor="name">Soal</InputLabel>
                <TextEditorInput
                  contentValue={field.value}
                  contentValueHandler={field.onChange}
                  imageValue={form.getValues('images') ?? []}
                  imageValueHandler={images =>
                    form.setValue('images', images as string[])
                  }
                  editorRef={editorRef}
                />
                <InputError
                  className="mt-2"
                  message={form.formState.errors.content?.message}
                />
              </>
            );
          }}
        />

        {form.getValues('type') == 'pilihan' ? (
          <PilihanForm form={form} />
        ) : null}
      </div>
    </div>
  );
}

type QuestionFormPilihanModel = BaseQuestionModel & AnswerTypePilihanFormModel;

function PilihanForm({
  form,
}: {
  form: UseFormReturn<QuestionFormPilihanModel>;
}) {
  const answerArray = useFieldArray({
    name: 'answers.choices',
    control: form.control,
  });

  return (
    <>
      {answerArray.fields.map((it, index) => {
        const editorRef = useRef();
        return (
          <React.Fragment key={it.id}>
            <InputLabel htmlFor="name">Jawaban {index + 1}</InputLabel>
            <TextEditorInput
              contentValue={it.content}
              contentValueHandler={(value: unknown) => {
                form.setValue(
                  `answers.choices.${index}.content`,
                  value as string,
                );
                // answerArray.update(index, {
                //   ...it,
                //   content: value as string,
                // });
              }}
              imageValue={it.images ?? []}
              imageValueHandler={images => {
                console.log(images);
                form.setValue(
                  `answers.choices.${index}.images`,
                  images as string[],
                );
              }}
              editorRef={editorRef}
            />
            <InputError
              className="mt-2"
              message={
                form.formState.errors.answers?.choices?.at?.(index)?.content
                  ?.message
              }
            />
          </React.Fragment>
        );
      })}

      <RadioGroup>
        {answerArray.fields.map((it, index) => {
          return (
            <Controller
              name="answers.right_answer"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormControlLabel
                    value={it.id}
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
