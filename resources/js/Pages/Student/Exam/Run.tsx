import ExamLayout from '@/Layouts/Student/ExamLayout';
import Button from '@mui/material/Button';
import React from 'react';
import Countdown from 'react-countdown';
import { useFieldArray, useForm } from 'react-hook-form';
import { router } from '@inertiajs/react';
import route from 'ziggy-js';
import { useDebounce} from 'react-use';
import { ExamAnswerModel, ExamModel, ExamPilihanModel } from '@/Models/Exam';
import axios from 'axios';
import ReactLoading from 'react-loading';
import Answer from './Answer';
import { useConfirm } from 'material-ui-confirm';
import { asset } from '@/Models/Helper';
import { useSearchParam } from '@/Hooks/useSearchParam';
import { Navigation } from './Navigation';

export interface Props {
  exam: ExamModel;
}

export interface Task {
  exam_answer_id: string;

  state: {
    mark: boolean;
  };

  answer: any;
}

export default function Run({ exam }: Props) {
  const time = new Date(Date.parse(exam.expire_in));
  const { answers } = exam;

  const confirm = useConfirm();

  const form = useForm({
    defaultValues: exam,
  });

  const answerArray = useFieldArray({
    control: form.control,
    name: 'answers',

    keyName: 'idHash',
  });

  const countdownRenderer = ({
    formatted: { hours, minutes, seconds},
    completed
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

  const [stateQueue, setStateQueue] = React.useState<Task[]>([]);

  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

  const setCurrentQuestion = React.useCallback((index: number) => {
    const url = new URL(location.toString());
    url.searchParams.set('question', (index + 1).toString());
    history.pushState({}, '', url);
  }, []);

  const [previousQueuePromise, setPreviousQueuePromise] =
    React.useState<Promise<Task[]> | null>(null);

  const [isUpdating, setIsUpdating] = React.useState(false);

  const isLastQuestion = () => currentQuestion === answers.length - 1;
  useDebounce(
    () => {
      if (stateQueue.length == 0) {
        return;
      }

      const queuePromise = (async () => {
        const prev = await previousQueuePromise;

        // so if the previous attempt is failed, this can retry it
        const queue = [...(prev ?? []), ...stateQueue];
        console.log(queue);

        // clear queue
        setStateQueue([]);

        try {
          setIsUpdating(true);
          let response = await axios.post(
            route('student.exam.update', exam.id),
            {
              _method: 'put',
              exam_id: exam.id,
              queue,
            },
          );

          if (response.data['finished']) {
            // TODO: create exam attempt page
            location.reload();
          }
          setIsUpdating(false);
          return [];
        } catch (e) {
          console.error(e);
          return queue;
        }
      })();

      setPreviousQueuePromise(queuePromise);
    },
    2000,
    [stateQueue],
  );

  const addStateQueue = (task: Task) => {
    setIsUpdating(true);
    // console.log('addStateQueue', [...stateQueue, task]);
    setStateQueue([...stateQueue, task]);
  };

  const updateAnswer = (answer: ExamAnswerModel) => {
    answerArray.update(currentQuestion, answer);

    addStateQueue({
      exam_answer_id: answer.id,
      state: answer.state,
      answer: answer.answer,
    });
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

  return (
    <ExamLayout title="ABC-CAT">
      <div className="flex flex-col mx-7 gap-3 mt-5">
        <div className="flex justify-between ">
          <div />
          <div className="shadow-2xl shadow-blue-400/50 rounded-3xl px-3 py-2 text-red-500 text-xl bg-white">
            <Countdown date={time} renderer={countdownRenderer} />
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
                        3. Klik tombol "Kumpulkan Jawaban" untuk mengakhiri
                        ujian
                      </p>
                    </div>
                    <Navigation
                      answers={answerArray.fields}
                      setCurrentQuestion={setCurrentQuestion}
                      currentQuestion={currentQuestion}
                      getState={(it, index) => {
                        if (exam.exercise_question.type == 'Kecermatan') {
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
                      <div className="font-bold text-2xl">
                        Soal {currentQuestion + 1}
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
                        <p className="text-2xl">{`${currentQuestion + 1}/${answers.length
                          }`}</p>
                      </div>
                    </div>
                  </div>
                  <div className='relative flex'>
                    <div className='absolute w-full h-full'>
                      <div className='flex justify-center h-full w-full p-10'>
                        <div className='flex justify-center'>
                          <img
                            src={asset('root', 'assets/image/logo.png')}
                            alt="logo"
                            className='w-full opacity-40'
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-auto p-3 flex flex-col gap-3 z-50">
                      <Answer
                        answer={answerArray.fields[currentQuestion]}
                        updateAnswer={answer => {
                          updateAnswer({
                            ...answers[currentQuestion],
                            answer: answer.answer,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <div>
                <button
                  className="bg-yellow-500 hover:bg-yellow-700 text-black font-bold py-2 px-8 rounded"
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
                  {answerArray.fields[currentQuestion].state?.mark
                    ? 'Batal Tandai'
                    : 'Tandai'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExamLayout>
  );
}
