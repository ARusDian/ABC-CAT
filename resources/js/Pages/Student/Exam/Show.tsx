import LazyLoadMRT from '@/Components/LazyLoadMRT';
import LinkButton from '@/Components/LinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { Link, router } from '@inertiajs/react';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
  exams: Model[];
}

type Model = ExamModel & {
  answers_sum_score: number;
  answers_count: number;
};

export default function Show({ exams, exercise_question }: Props) {
  console.log(exercise_question);

  const dataColumns = [
    {
      header: 'Waktu Mulai',
      accessorFn: it => new Date(it.created_at).toLocaleString(),
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: it => new Date(it.finished_at).toLocaleString(),
    },
    {
      header: 'Skor',
      accessorFn: it => {
        return (
          <div>
            {parseFloat(it.answers_sum_score?.toString() ?? '0')}
            {/* {parseFloat(it.answers_sum_score?.toString() ?? '0')}/ */}
            {/* {it.answers_count} ( */}
            {/* {((it.answers_sum_score ?? 0) * 100) / it.answers_count}%) */}
          </div>
        );
      },
    },
  ] as MRT_ColumnDef<Model>[];

  const [startExamButton, setStartExamButton] = React.useState(false);

  const onStartExam = React.useCallback(() => {
    setStartExamButton(true);
    const onAll = () => {
      setStartExamButton(false);
    };
    router.post(
      route('student.exam.attempt', [exercise_question.id]),
      {
        current_timestamp: new Date(),
      },
      {
        onError: onAll,
        onFinish: () => {},
      },
    );

    // <Link
    //   href={route('student.exam.attempt', [
    //     exercise_question.id,
    //   ])}
    //   method="post"
    // >
  }, []);

  return (
    <DashboardLayout title={exercise_question.name}>
      <div className="flex flex-col gap-8 ">
        <div className="flex justify-between">
          <p className="text-5xl text-[#3A63F5]">Pengerjaan Latihan Soal</p>
          <LinkButton
            href={route('student.packet.category.exercise.index', [
              exercise_question.learning_category?.sub_learning_packet
                ?.learning_packet_id,
              exercise_question.learning_category?.sub_learning_packet_id,
              exercise_question.learning_category_id,
            ])}
            colorCode="#3A63F5"
            className="px-5 rounded-md"
          >
            Kembali
          </LinkButton>
        </div>
        <div className="shadow-lg w-full h-full p-7 rounded-2xl shadow-[#c5d2ff] bg-white">
          <p className="my-3 text-2xl font-semibold text-center">
            Data Latihan Soal
          </p>
          <div className="flex flex-col w-full gap-3 ">
            <div className="flex basis-1/2 border-b">
              <div className="flex flex-col basis-1/2 gap-1">
                <p className="text-lg font-bold">Nama Latihan Soal</p>
                <p className="text-lg">{exercise_question.name}</p>
              </div>
              <div className="flex flex-col basis-1/2 gap-1">
                <p className="text-lg font-bold">Tipe Soal</p>
                <p className="text-lg">{exercise_question.type}</p>
              </div>
            </div>
            <div className="flex basis-1/2">
              <div className="flex flex-col basis-1/2 gap-1">
                <p className="text-lg font-bold">
                  Jumlah Soal{' '}
                  {exercise_question.type === 'Kecermatan'
                    ? ' per Kolom '
                    : ' '}
                </p>
                <p className="text-lg">
                  {exercise_question.number_of_question}
                </p>
              </div>
              <div className="flex flex-col basis-1/2 gap-1">
                <p className="text-lg font-bold">
                  Waktu Pengerjaan
                  {exercise_question.type === 'Kecermatan'
                    ? ' per Kolom '
                    : ' '}
                </p>
                <p className="text-lg">{exercise_question.time_limit} menit</p>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-lg w-full h-full p-7 rounded-2xl shadow-[#c5d2ff] bg-white flex flex-col gap-2">
          <div className="flex justify-between">
            <p className="my-3 text-2xl font-semibold">
              Riwayat Pengerjaan Latihan Soal
            </p>
            <LinkButton
              href={route('student.exam.leaderboard', [exercise_question.id])}
              colorCode="#3A63F5"
              className="px-5 rounded-md"
            >
              Ranking
            </LinkButton>
          </div>
          <LazyLoadMRT
            columns={dataColumns}
            data={exams}
            enableColumnActions
            enableColumnFilters
            enablePagination
            enableSorting
            enableBottomToolbar
            enableTopToolbar
            enableRowActions
            enableRowNumbers
            muiTableBodyRowProps={{ hover: false }}
            renderRowActions={({ row }) => (
              <div className="flex items-center justify-center gap-2">
                <LinkButton
                  href={route('student.exam.show.attempt', [
                    exercise_question.id,
                    row.original.id,
                  ])}
                  colorCode="#3A63F5"
                  className="px-5 rounded-md"
                >
                  Evaluasi
                </LinkButton>
                <LinkButton
                  href={route('student.exam.show.result', [
                    exercise_question.id,
                    row.original.id,
                  ])}
                  colorCode="#00b506"
                  className="px-5 rounded-md"
                >
                  Lihat Hasil
                </LinkButton>
              </div>
            )}
            renderTopToolbarCustomActions={() => (
              <button
                className="text-white font-sans bg-[#3A63F5] text-center rounded-md my-auto py-3 font-thin hover:brightness-90 uppercase px-5"
                onClick={onStartExam}
                disabled={startExamButton}
              >
                Mulai Ujian
              </button>
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
