import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';

// import Form from './Form';
import { BaseQuestionModel, QuestionFormModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import { AutoSizer, Grid, List, ScrollSync } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Checkbox from '@mui/material/Checkbox';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

//function to get the combinations of input array
function permutation<T>(array: T[]): T[][] {
  var results: T[][] = [];

  function permute(arr: T[], memoArg?: T[]) {
    let cur,
      memo = memoArg ?? [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(array);
}

export default function Create(props: Props) {
  let form = useForm<QuestionFormModel>({
    defaultValues: {
      question: {},
      weight: 1,
      type: 'Kecermatan',
      answer: 0,
      answers: {
        choices: [],
      },
      explanation: undefined,
    },
  });

  const [generateWith, setGenerateWith] = React.useState([
    null,
    null,
    null,
    null,
    null,
  ] as (string | null)[]);

  const generatePermutate = React.useCallback(() => {
    const permutate = permutation(generateWith);

    return permutate.map(it => {
      const [tail, ...arr] = it.concat().reverse();

      return {
        choices: arr.reverse() as string[],
        answer: tail as string,
        selected: false,
      };
    });
  }, [generateWith]);

  const [permutate, setPermutate] = React.useState<
    { choices: string[]; answer: string; selected: boolean }[] | null
  >(null);

  function onSubmit(e: QuestionFormModel) {
    form.clearErrors();

    if (!permutate) {
      // form.setError("")
      return;
    }

    const data = {
      type: 'Kecermatan',
      weight: 1,

      stores: permutate.map(it => {
        return {
          question: { questions: it.choices },
          answers: { choices: generateWith },
          answer: generateWith
            .map((choice, index) => {
              if (it.answer == choice) {
                return index;
              } else {
                return null;
              }
            })
            .find(it => it != null),
          explanation: {},
        };
      }),
    };

    router.post(
      route(
        'exercise-question.question.store-many',
        props.exercise_question.id,
      ),
      data as any,
      {
        onError: errors => {
          console.log(errors);
        },
        onSuccess: () => {
          console.log('success');
        },
      },
    );
  }

  const columnCount = 6;

  return (
    <AdminFormLayout
      title="Tambah Pertanyaan"
      backRoute={route('exercise-question.show', [props.exercise_question.id])}
      backRouteTitle="Kembali"
    >
      <form
        className="flex-col gap-5 py-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {generateWith.map((it, index) => {
          return (
            <TextField
              key={index}
              label={`Soal ${index + 1}`}
              onChange={e => {
                setGenerateWith(
                  generateWith.map((it, i) => {
                    if (i == index) {
                      return e.target.value;
                    } else {
                      return it;
                    }
                  }),
                );
              }}
            />
          );
        })}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            disabled={form.formState.isSubmitting}
            onClick={() => {
              setPermutate(generatePermutate());
            }}
          >
            Generate
          </Button>
        </div>

        {permutate != null ? (
          <AutoSizer disableHeight>
            {({ width }) => (
              <ScrollSync>
                {({ scrollLeft }) => (
                  <div className="Table">
                    <Grid
                      height={40}
                      width={width}
                      rowHeight={40}
                      columnWidth={width / columnCount}
                      cellRenderer={({ columnIndex, key, style }) => {
                        let text;
                        if (columnIndex == 0) {
                          text = 'Nomor';
                        } else if (columnIndex == columnCount - 1) {
                          text = 'Jawaban';
                        } else {
                          text = `Soal ${columnIndex}`;
                        }

                        return (
                          <div key={key} style={style}>
                            {text}
                          </div>
                        );
                      }}
                      rowCount={1}
                      columnCount={columnCount}
                      scrollLeft={scrollLeft}
                    />

                    <Grid
                      height={500}
                      width={width}
                      rowHeight={40}
                      columnWidth={width / columnCount}
                      // overscanColumnCount={overscanColumnCount}
                      cellRenderer={({ columnIndex, key, rowIndex, style }) => {
                        const it = permutate[rowIndex];
                        let text;
                        if (columnIndex == 0) {
                          text = rowIndex + 1;
                        } else if (columnIndex == columnCount - 1) {
                          text = it.answer;
                        } else {
                          text = it.choices[columnIndex - 1];
                        }

                        return (
                          <div key={key} style={style}>
                            {text}
                          </div>
                        );
                      }}
                      rowCount={permutate?.length ?? 0}
                      columnCount={columnCount}
                      scrollLeft={scrollLeft}
                    />
                  </div>
                )}
              </ScrollSync>
            )}
          </AutoSizer>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </div>
      </form>
    </AdminFormLayout>
  );
}
