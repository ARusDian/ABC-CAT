import React from 'react';
import { ExamNavigation } from '../ExamNavigation';
import ExamAnswer from '../ExamAnswer';
import { ExamModel } from '@/Models/Exam';
import { asset } from '@/Models/Helper';
import { useSearchParam } from '@/Hooks/useSearchParam';

interface Props {
  exam: ExamModel;
}

export default function Show({ exam }: Props) {
  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

  const setCurrentQuestion = React.useCallback((index: number) => {
    const url = new URL(location.toString());
    url.searchParams.set('question', (index + 1).toString());
    history.pushState({}, '', url);
  }, []);

  console.log(exam);

  return (
    <>
      <div className="flex justify-between p-3">
        <div className="text-4xl">
          <span className="font-bold">Hasil Ujian</span>
        </div>
      </div>
      <div className="flex">
        <div className=" text-lg">
          <p>{exam.user.name}</p>
          <p>{exam.user.email}</p>
          <p>
            Selesai :{' '}
            {exam.finished
              ? new Date(exam.finished_at).toLocaleString()
              : 'Belum Selesai'}
          </p>
          {exam.answers_sum_score != null && (
            <p>
              Skor : {exam.answers_sum_score} ({exam.answers_count} soal)
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-gray-500 w-auto h-auto p-3 flex gap-6 divide-x">
        <ExamNavigation
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          isEvaluation
          answers={exam.answers}
          getState={it => {
            console.log(it);
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
            <div className="w-full h-auto p-3 flex flex-col gap-3 ">
              <ExamAnswer answer={exam.answers[currentQuestion]} isEvaluation />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
