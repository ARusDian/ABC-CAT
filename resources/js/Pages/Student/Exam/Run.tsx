import ExamLayout from '@/Layouts/Student/ExamLayout';
import parse from 'html-react-parser';
import { QuestionModel } from '@/Models/Question';
import Button from '@mui/material/Button';
import React from 'react';
import Countdown from 'react-countdown';
import { useFieldArray, useForm } from 'react-hook-form';
import { Inertia } from '@inertiajs/inertia';
import route from 'ziggy-js';

export interface Props {
  exam: {
    id: string;
    exercise_question_id: number;

    answers: {
      id: number;
      exam_id: number;
      answer: any;
      state: any;

      question: QuestionModel;
    }[];
  };
}

export default function Run({ exam }: Props) {
  const time = Date.now() + 50000;
  const { answers } = exam;

  const form = useForm({
    defaultValues: exam,
  });

  const answerArray = useFieldArray({
    control: form.control,
    name: 'answers',
  });

  const [currentQuestion, setCurrentQuestion] = React.useState(0);

  const renderer = ({
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
                <Countdown date={time} renderer={renderer} />
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
                              it.state?.flag
                                ? 'warning'
                                : it.answer
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
                  <div className="flex justify-between p-3">
                    <div className="font-bold text-lg">
                      Soal {currentQuestion + 1}
                    </div>
                    <div className="font-bold text-lg">{`${
                      currentQuestion + 1
                    }/${answers.length}`}</div>
                  </div>
                </div>
                <div className="border-t border-gray-500 w-auto h-auto p-3 flex flex-col gap-3">
                  <div className="porse text-md">
                    {parse(answers[currentQuestion].question.content)}
                  </div>
                  <div className="flex flex-col gap-3">
                    {answerArray.fields[
                      currentQuestion
                    ].question.answers.choices.map((answer, index) => {
                      return (
                        <div className="flex justify-between" key={index}>
                          <div className="flex gap-3">
                            <input
                              type="radio"
                              name="answer"
                              onChange={() => {
                                answerArray.update(currentQuestion, {
                                  ...answerArray.fields[currentQuestion],
                                  answer: index,
                                });
                                // form.setValue(
                                //   `answers.${currentQuestion}.answer`,
                                //   index,
                                // );
                                // console.log(index);
                                // answers[currentQuestion].answer = index;
                                // const newAnswers = [...answers];
                                // newAnswers[currentQuestion] = {
                                //   questionId: questions[currentQuestion].id,
                                //   flag: false,
                                //   answerId: answer.id,
                                // };
                                // setAnswers(newAnswers);
                              }}
                              checked={
                                answerArray.fields[currentQuestion].answer ==
                                index
                                /* answers[currentQuestion]?.answerId === answer.id */
                              }
                            />
                            <div className="prose mx-auto">{parse(answer)}</div>
                          </div>
                        </div>
                      );
                    })}
                    {/* {questions[currentQuestion].answers.map((answer, index) => ( */}
                    {/* ))} */}
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="contained"
                      color="warning"
                      className="w-1/2"
                      onClick={() => {
                      const value
                     = answerArray.fields[currentQuestion];
                      answerArray.update(currentQuestion, {
                      ...value,
                        state: {
                            ...value.state,
                            flag: !value.state?.flag
                        }
                      })
                        // const newAnswers = [...answers];
                        // newAnswers[currentQuestion] = {
                        //   answerId: newAnswers[currentQuestion]?.answerId,
                        //   questionId: questions[currentQuestion].id,
                        //   flag: !newAnswers[currentQuestion]?.flag,
                        // };
                        // setAnswers(newAnswers);
                      }}
                    >
                      {answerArray.fields[currentQuestion].state?.flag
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
