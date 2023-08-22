import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExamModel } from '@/Models/Exam';
import { router } from '@inertiajs/react';
import React from 'react';
import { useIdle, useInterval } from 'react-use';
import { useSearchParam } from '@/Hooks/useSearchParam';
import route from 'ziggy-js';
import { ExamNavigation } from '@/Components/ExamNavigation';
import ExamAnswer from '@/Components/ExamAnswer';
import { asset } from '@/Models/Helper';

interface Props {
  exam: ExamModel;
}

export default function Show(props: Props) {
  const { exam } = props;
  const isIdle = useIdle(5000);
  const re = React.useRef(0);

  const currentQuestion =
    (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

  const setCurrentQuestion = React.useCallback((index: number) => {
    const url = new URL(location.toString());
    router.reload({
      replace: true,
      preserveScroll: true,
      preserveState: true,
      data: {
        question: index + 1,
      },
      only: [],
    });
    history.pushState({}, '', url);
  }, []);

  useInterval(() => {
    if (!isIdle) {
      console.error({ href: location.href });
      console.log('reloading', re);
      router.reload({
        only: ['exam'],
        data: {
          question: currentQuestion + 1,
        },
      });
      re.current += 1;
    } else {
      console.log({ isIdle });
    }
  }, 5000);

  return (
    <AdminShowLayout
      title="Monitor Latihan"
      headerTitle="Monitoring Ujian"
      backRoute={route('user.exam.index', [exam.user.id])}
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
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
          </div>
        </div>

        <div className="">
          <div className="border-t border-gray-500 w-auto h-auto p-3 flex gap-6 divide-x justify-center">
            <ExamNavigation
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
                  <ExamAnswer answer={exam.answers[currentQuestion]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShowLayout>
  );
}
