import { ExamModel } from '@/Models/Exam';
import React from 'react';
import Answer from './Answer';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { Button } from '@mui/material';
import { Link } from '@inertiajs/react'
import route from 'ziggy-js';
import { useSearchParam } from 'react-use';

interface Props {
  exam: ExamModel;
}

export default function ShowAttempt({exam}: Props) {
  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

  const setCurrentQuestion = React.useCallback((index: number) => {
    const url = new URL(location.toString());
    url.searchParams.set('question', (index + 1).toString());
    history.pushState({}, '', url);
  }, []);

  return (
    <DashboardLayout
      title="Evaluasi"
    >
      <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#7c98fd]">
        <div className="flex justify-between p-3">
          <div className="text-4xl">
            <span className="font-bold">Hasil Ujian</span>
          </div>
          <div className="text-lg">
            <Button variant="contained" color="primary" size="large">
              <Link
                href={route(
                  'exam.show',
                  exam.exercise_question_id,
                )}
              >
                Kembali
              </Link>
            </Button>
          </div>
        </div>
        <div className="border-t border-gray-500 w-auto h-auto p-3 flex gap-6 divide-x">
          <div className="flex flex-col p-3 basis-1/3">
            <p className="font-bold text-lg">Navigasi Soal</p>
            <div className="p-2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-10 gap-2">
              {exam.answers.map((it, index) => {
                return (

                  <Button
                    className="text-center border-2  rounded-md p-2"
                    variant="contained"
                    color={
                      it.score === null
                        ? 'inherit'
                        : it.score == 0
                          ? 'error'
                          : 'success'
                    }
                    onClick={() => setCurrentQuestion(index)}
                    key={index}
                  >
                      {index + 1}
                  </Button>
                );
              })}
            </div>
            <div className='flex justify-between gap-3'>
              <Button
                variant="contained"
                color="primary"
                className="w-1/2"
                onClick={() => {
                  setCurrentQuestion(currentQuestion - 1);
                }}
                disabled={currentQuestion === 0}
              >
                Sebelumnya
              </Button>
              <Button
                variant="contained"
                color='primary'
                className="w-1/2"
                onClick={() => {
                  setCurrentQuestion(currentQuestion + 1);
                }}
                disabled={currentQuestion === exam.answers.length - 1}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
          <div className='className="flex flex-col p-3 basis-2/3'>
            <p className='text-lg font-semibold'> Soal {currentQuestion + 1} ({parseFloat(exam.answers[currentQuestion].score.toString())})</p>
            <Answer answer={exam.answers[currentQuestion]} isEvaluation />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
