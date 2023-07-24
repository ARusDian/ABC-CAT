import ExamLayout from '@/Layouts/Student/ExamLayout';
import Button from '@mui/material/Button';
import React from 'react';
import Countdown from 'react-countdown';
import { UseFieldArrayReturn, useFieldArray, useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';
import route from 'ziggy-js';
import QuestionEditor from '@/Components/QuestionEditor';
import { Editor } from '@tiptap/react';
import { ExamAnswerModel, ExamModel, ExamPilihanModel } from '@/Models/Exam';
import { useDebounce, useSearchParam } from 'react-use';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { QuestionShow } from '@/Components/QuestionShow';
import {
  QuestionKecermatanModel,
  QuestionPilihanModel,
} from '@/Models/Question';
import Typography from '@mui/material/Typography';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import Answer from './Answer';

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

  const form = useForm({
    defaultValues: exam,
  });

  const answerArray = useFieldArray({
    control: form.control,
    name: 'answers',

    keyName: 'idHash',
  });

  const countdownRenderer = ({
    hours,
    minutes,
    seconds,
    completed,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
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

  // const [currentQuestion, setCurrentQuestion] = React.useState(0);
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
          let response = await axios.post(route('exam.update', exam.id), {
            _method: 'put',
            exam_id: exam.id,
            queue,
          });

          if (response.data['finished']) {
            // TODO: create exam attempt page
            location.reload();
          }
          setIsUpdating(false);
          return [];
        } catch (e) {
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
    Inertia.post(route('exam.finish', exam.exercise_question_id));
  }

  return (
    <ExamLayout title="Template Exam">
      <div className="flex justify-center mx-5 my-10">
        <div className="w-full h-auto border-2 border-black">
          <div className="flex flex-col gap-5">
            <div className="text-xl lg:text-xl font-bold flex justify-between p-3">
              <div>Nama Ujian</div>
              <div className="border border-gray-900 px-3">
                <Countdown date={time} renderer={countdownRenderer} />
              </div>
            </div>
            <div className="flex flex-col-reverse md:flex-row  border-t-2 border-gray-800">
              <div className="w-full md:w-1/3 border-b-2 md:border-r-2 border-gray-800">
                <div className="flex flex-col ">
                  <div className="p-3  ">
                    <span className="font-bold text-lg">Petunjuk Soal :</span>
                    <p>1. Baca soal dengan teliti</p>
                    <p>2. Pilih jawaban yang menurut anda benar</p>
                    <p>
                      3. Klik tombol "Kumpulkan Jawaban" untuk mengakhiri ujian
                    </p>
                  </div>
                  <div className="flex flex-col justify-center p-3">
                    <p className="font-bold text-lg">Navigasi Soal</p>
                    <div className="p-2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-10 gap-2">
                      {answerArray.fields.map((it, index) => {
                        return (
                          <Button
                            className="text-center border-2 border-gray-800 rounded-md p-2"
                            variant="contained"
                            color={
                              it.state?.mark
                                ? 'warning'
                                : it.answer != undefined
                                ? 'primary'
                                : currentQuestion === index
                                ? 'success'
                                : 'inherit'
                            }
                            onClick={() => setCurrentQuestion(index)}
                            key={index}
                          >
                            {index + 1}
                          </Button>
                        );
                      })}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="contained"
                        color="primary"
                        className="w-1/2"
                        onClick={onSelesaiUjian}
                      >
                        Selesai Ujian
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/3 border-b-2 border-gray-800">
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between p-3 h-20 py-auto">
                    <div className="font-bold text-lg">
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
                      <p>{`${currentQuestion + 1}/${answers.length}`}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-500 w-auto h-auto p-3 flex flex-col gap-3">
                  <Answer
                    answer={answerArray.fields[currentQuestion]}
                    updateAnswer={answer => {
                      updateAnswer({
                        ...answers[currentQuestion],
                        answer: answer.answer,
                      });
                    }}
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="contained"
                      color="warning"
                      className="w-1/2"
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
                    </Button>
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
