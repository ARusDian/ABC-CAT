import ExamLayout from '@/Layouts/Student/ExamLayout';
import Button from '@mui/material/Button';
import React from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useFieldArray, useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import { useCounter, useDebounce, useEffectOnce, useUpdate } from 'react-use';
import { ExamAnswerModel, ExamModel, ExamPilihanModel } from '@/Models/Exam';
import axios from 'axios';
import ReactLoading from 'react-loading';
import ExamAnswer from '../../../Components/ExamAnswer';
import { useConfirm } from 'material-ui-confirm';
import { asset } from '@/Models/Helper';
import { useSearchParam } from '@/Hooks/useSearchParam';
import { ExamNavigation } from '../../../Components/ExamNavigation';
import _ from 'lodash';

export interface Props {
  exam: ExamModel;
  timestamp: number;
}

export type Task =
  | {
    change_answer: {
      exam_answer_id: string;

      state: {
        mark: boolean;
      };

      answer: any;
    };
  }
  | {
    change_question: {
      date: Date;
      question: number;
      exam_answer_id?: string;
    };
  }
  | {
    check_finished: {};
  }
  | {
    finish: {};
  };

export default function Run({ exam, timestamp }: Props) {
  const { answers } = exam;

  const confirm = useConfirm();

  const form = useForm({
    defaultValues: exam,
  });

  const delayedDate = React.useMemo(
    () => new Date(exam.server_state.timestamp_delay),
    [exam.server_state.timestamp_delay],
  );

  const convertServerTimestamp = (time: number) => {
    return new Date(time + delayedDate.getTime());
  };

  const convertServerDateTime = (time: string) => {
    const t = new Date(time);

    return new Date(t.getTime() + delayedDate.getTime());
  };

  const createdAt = React.useMemo(
    () => convertServerDateTime(exam.created_at),
    [exam.created_at],
  );

  const expireInTime = React.useMemo(
    () => convertServerDateTime(exam.expire_in),
    [exam.expire_in],
  );

  const [updateCount, { inc: update }] = useCounter(1);

  const {
    time_limit_per_cluster: splitQuestionByCluster,
    next_question_after_answer: changeAnswerAfterAnswering,
  } = exam.options.exercise_question;

  const currentClusterDateEnd = React.useMemo(() => {
    if (splitQuestionByCluster) {
      let minutes = exam.exercise_question.time_limit;
      let count = 1;

      const current = () => {
        let time = createdAt.getTime() + minutes * count * 60000 + 3000; // 3000 is for 3 second
        return new Date(time);
      };

      while (current() < new Date()) {
        count += 1;
      }

      return { current: current(), count: count - 1 };
    } else {
      return { current: expireInTime, count: 0 };
    }
  }, [updateCount]);

  const currentCluster = React.useMemo(() => {
    const cluster = _.uniq(_.map(exam.answers, 'cluster'));
    const count = currentClusterDateEnd.count;

    return cluster[count];
  }, [currentClusterDateEnd.count]);

  const answerArray = useFieldArray({
    control: form.control,
    name: 'answers',

    keyName: 'idHash',
  });

  const countdownRenderer = ({
    formatted: { hours, minutes, seconds },
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      return <span>Waktu Selesai</span>;
    } else {
      // Render a countdown
      return (
        <span>
          Sisa Waktu {hours}:{minutes}:{seconds}
        </span>
      );
    }
  };

  const [isUpdating, setIsUpdating] = React.useState(false);

  const [stateQueue, setStateQueue] = React.useState<Task[]>([]);
  const addStateQueue = (task: Task[]) => {
    setIsUpdating(true);
    setStateQueue([...stateQueue, ...task]);
  };
  const [previousQueuePromise, setPreviousQueuePromise] =
    React.useState<Promise<Task[]> | null>(null);
  const [stateQueueCounter, { inc: updateStateQueueCounter }] = useCounter(0);

  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;
  const isLastQuestion = currentQuestion === answers.length - 1;

  const isLastQuestionInCluster = React.useMemo(() => {
    if (splitQuestionByCluster) {
      return answers?.at(currentQuestion + 1)?.cluster != currentCluster;
    } else {
      return isLastQuestion;
    }
  }, [answers, currentQuestion, currentCluster]);

  const doSetCurrentQuestion = (index: number): Task[] => {
    const url = new URL(location.toString());
    url.searchParams.set('question', (index + 1).toString());
    history.pushState({}, '', url);

    return [
      {
        change_question: {
          date: new Date(),
          question: index,
          exam_answer_id: answers[index]?.id,
        },
      },
    ];
  };

  const setCurrentQuestion = (index: number) => {
    const tasks = doSetCurrentQuestion(index);

    addStateQueue(tasks);
  };

  useEffectOnce(() => {
    addStateQueue([
      {
        change_question: {
          date: new Date(),
          question: currentQuestion,
          exam_answer_id: answers[currentQuestion]?.id,
        },
      },
    ]);
  });

  React.useEffect(() => {
    if (splitQuestionByCluster) {
      if (answers?.at(currentQuestion)?.cluster != currentCluster) {
        const index = answers.findIndex(it => it.cluster == currentCluster);
        if (index == -1) {
          setCurrentQuestion(answers.length);

          if (stateQueue.length == 0) {
            location.reload();
          }
        } else {
          setCurrentQuestion(index);
        }
      }

      setTimeout(() => {
        update();
      }, currentClusterDateEnd.current.getTime() - Date.now());
    }
  }, [currentCluster, currentQuestion]);

  useDebounce(
    () => {
      if (stateQueue.length == 0) {
        return;
      }
      setStateQueue([]);

      const queuePromise = (async () => {
        // clear queue so we if next this is called again before await is done,
        // the current queue is not run again
        const prev = await previousQueuePromise;

        // so if the previous attempt is failed, this can retry it
        const queue = [...(prev ?? []), ...stateQueue];

        try {
          setIsUpdating(true);

          let response = await axios.post(
            route('student.exam.update', exam.id),
            {
              _method: 'put',
              exam_id: exam.id,
              current_timestamp: new Date(),
              queue,
            },
          );

          if (response.data['finished']) {
            // TODO: create exam attempt page
            location.reload();
          }
          // router.post(
          //   route('student.exam.update', exam.id),
          //   {
          //     _method: 'put',
          //     exam_id: exam.id,
          //     queue,
          //   },
          //   {
          //     onError: e => {
          //       console.log(e);
          //     },
          //     data: {
          //       question: currentQuestion,
          //     },
          //   },
          // );

          setIsUpdating(false);
          return [];
        } catch (e) {
          console.error(e);
          updateStateQueueCounter();
          return queue;
        }
      })();

      setPreviousQueuePromise(queuePromise);
    },
    2000,
    [stateQueue, stateQueueCounter],
  );

  const doUpdateAnswer = (answer: ExamAnswerModel) => {
    answerArray.update(currentQuestion, answer);

    let tasks: Task[] = [
      {
        change_answer: {
          exam_answer_id: answer.id,
          state: answer.state,
          answer: answer.answer,
        },
      },
    ];

    if (changeAnswerAfterAnswering && !isLastQuestionInCluster) {
      tasks = [...tasks, ...doSetCurrentQuestion(currentQuestion + 1)];
    }

    return tasks;
  };
  const updateAnswer = (answer: ExamAnswerModel) => {
    const tasks = doUpdateAnswer(answer);

    addStateQueue(tasks);
  };

  function onSelesaiUjian() {
    confirm({
      title: 'Selesai Ujian',
      description: 'Yakin Sudah Selesai Mengerjakan Ujian',
    })
      .then(() => {
        router.post(route('student.exam.finish', exam.exercise_question_id));
      })
      .catch(e => {
        console.log('Confirmation was rejected', e);
      });
  }

  const userCurrentQuestion = answers?.at(currentQuestion)
    ? currentQuestion + 1
    : null;

  return (
    <ExamLayout title="ABC-CAT">
      <div className="flex flex-col mx-7 gap-3 mt-5">
        <div className="flex justify-between ">
          <div />
          <div className="shadow-2xl shadow-blue-400/50 rounded-3xl px-3 py-2 text-red-500 text-xl bg-white">
            <Countdown
              date={currentClusterDateEnd.current}
              renderer={countdownRenderer}
              key={updateCount}
              onComplete={() => {
                addStateQueue([
                  {
                    check_finished: {
                      date: new Date(),
                    },
                  },
                ]);
              }}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color="error"
              onClick={onSelesaiUjian}
              disabled={isUpdating}
            >
              Selesai Ujian
            </Button>
          </div>
        </div>
        <div className="flex justify-center mb-10">
          <div className="w-full h-auto rounded-2xl shadow-xl shadow-blue-400/50 bg-white p-5">
            <div className="flex flex-col gap-5">
              <div className="text-xl lg:text-3xl font-bold flex justify-between p-3">
                <div>{exam.exercise_question.name}</div>
              </div>
              <div className="flex flex-col-reverse md:flex-row">
                <div className="w-full md:w-1/3 md:border-r-2 border-gray-200">
                  <div className="flex flex-col ">
                    <div className="p-3 text-lg">
                      <span className="font-bold text-2xl">
                        Petunjuk Soal :
                      </span>
                      <p>1. Baca soal dengan teliti</p>
                      <p>2. Pilih jawaban yang menurut anda benar</p>
                      <p>
                        3. Klik tombol"Kumpulkan Jawaban" untuk mengakhiri ujian
                      </p>
                    </div>
                    <ExamNavigation
                      answers={answerArray.fields}
                      setCurrentQuestion={setCurrentQuestion}
                      currentQuestion={currentQuestion}
                      getState={(it, index) => {
                        if (splitQuestionByCluster) {
                          if (currentCluster != it.cluster) {
                            return {
                              hide: true,
                            };
                          }
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 ">
                  <div className="flex flex-col gap-5">
                    <div className="flex justify-between p-3 h-20 py-auto">
                      <div className=" flex gap-3">
                        <p className="font-bold text-2xl">
                          {userCurrentQuestion ? (
                            <>Soal {userCurrentQuestion}</>
                          ) : null}
                        </p>
                        <div>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                              const value = answerArray.fields[currentQuestion];
                              answerArray.update(currentQuestion, {
                                ...value,
                                state: {
                                  ...value.state,
                                  mark: !value.state?.mark,
                                },
                              });
                              updateAnswer({
                                ...value,
                                state: {
                                  ...(value.state ?? {}),
                                  mark: !value.state?.mark,
                                },
                              });
                            }}
                          >
                            {answerArray.fields[currentQuestion]?.state?.mark
                              ? 'Batal Tandai'
                              : 'Tandai'}
                          </Button>
                        </div>
                      </div>
                      <div className="font-bold text-lg flex gap-3">
                        <div>
                          {isUpdating ? (
                            <div className="flex gap-2">
                              <ReactLoading color="#1964AD" type="spin" />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                        {userCurrentQuestion ? (
                          <p className="text-2xl">
                            {userCurrentQuestion} / {answers.length}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="relative flex">
                    <div className="absolute w-full h-full">
                      <div
                        className="flex justify-center h-full w-full p-10"
                        style={{
                          backgroundImage: `url(${asset(
                            'root',
                            'assets/image/logo.png',
                          )})`,
                          backgroundRepeat: 'repeat-y',
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          opacity: 0.1,
                        }}
                      ></div>
                    </div>
                    <div className="w-full h-auto p-3 flex flex-col gap-3 z-50">
                      {answerArray.fields[currentQuestion] != null ? (
                        <ExamAnswer
                          answer={answerArray.fields[currentQuestion]}
                          updateAnswer={answer => {
                            updateAnswer({
                              ...answers[currentQuestion],
                              answer: answer.answer,
                            });
                          }}
                        />

                      ) :
                        <div className="flex gap-2">
                          <div className='flex flex-col gap-3 mx-auto'>
                            <ReactLoading
                              color="#1964AD" type="spin"
                              width={200}
                              height={200}
                            />
                            <p className='text-center text-2xl font-bold'>
                              Sedang Memuat ...
                            </p>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExamLayout>
  );
}
