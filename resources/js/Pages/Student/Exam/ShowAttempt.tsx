import { ExamModel } from '@/Models/Exam';
import React from 'react';
import Answer from './Answer';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { Button } from '@mui/material';
import { Link } from '@inertiajs/react';
import route from 'ziggy-js';
import { asset } from '@/Models/Helper';
import { useSearchParam } from '@/Hooks/useSearchParam';
import { Navigation } from './Navigation';

interface Props {
  exam: ExamModel;
}

export default function ShowAttempt({ exam }: Props) {
  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

  const setCurrentQuestion = React.useCallback((index: number) => {
    const url = new URL(location.toString());
    url.searchParams.set('question', (index + 1).toString());
    history.pushState({}, '', url);
  }, []);

  return (
    <DashboardLayout title="Evaluasi">
      <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#7c98fd]">
        <div className="flex justify-between p-3">
          <div className="text-4xl">
            <span className="font-bold">Hasil Ujian</span>
          </div>
          <div className="text-lg">
            <Button variant="contained" color="primary" size="large">
              <Link
                href={route('student.exam.show', exam.exercise_question_id)}
              >
                Kembali
              </Link>
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-500 w-auto h-auto p-3 flex gap-6 divide-x">
          <Navigation
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            answers={exam.answers}
            getState={it => {
              return {
                isRight: it.score != 0,
              };
            }}
          />
          <div className='className="flex flex-col p-3 basis-2/3'>
            <p className="text-lg font-semibold">
              {' '}
              Soal {currentQuestion + 1} (
              {parseFloat(exam.answers[currentQuestion].score.toString())})
            </p>
            <div className="relative flex">
              <div className="absolute w-full h-full">
                <div className="flex justify-center h-full w-full p-10">
                  <div className="flex justify-center">
                    <img
                      src={asset('root', 'assets/image/logo.png')}
                      alt="logo"
                      className="w-full opacity-40"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full h-auto p-3 flex flex-col gap-3 ">
                <Answer answer={exam.answers[currentQuestion]} isEvaluation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
