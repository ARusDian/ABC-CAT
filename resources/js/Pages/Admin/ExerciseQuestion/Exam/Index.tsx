import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
  exams: ExamModel[];
}

export default function Leaderboard({ exercise_question, exams }: Props) {
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  const dataColumns = [
    { header: 'User', accessorKey: 'user.name' },
    {
      header: 'Waktu Mulai',
      accessorFn: it => new Date(it.created_at).toLocaleString(),
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: it => {
        if (it.finished_at === null) {
          return 'Belum Selesai';
        }
        return new Date(it.finished_at).toLocaleString();
      },
    },
    {
      header: 'Skor',
      accessorFn: it => {
        return <>{parseFloat(it.answers_sum_score?.toString() ?? '0')}</>;
      },
    },
  ] as MRT_ColumnDef<ExamModel>[];

  return (
    <AdminShowLayout
      title={`Riwayat Pengerjaan Latihan Soal ${exercise_question.name}`}
      headerTitle={`Riwayat Pengerjaan Latihan Soal ${exercise_question.name}`}
      backRoute={route('packet.sub.category.exercise.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exercise_question.id,
      ])}
    >
      <div className="mt-6 p-7 shadow-2xl shadow-sky-400/50 sm:rounded-3xl bg-white  flex flex-col gap-3">
        <div className="flex justify-between my-3">
          <p>
            <span className="font-bold">
              *Hanya Menampilkan Ujian yang Telah Selesai
            </span>{' '}
          </p>
          <div className="flex gap-3">
            <MuiInertiaLinkButton
              href={route('packet.sub.category.exercise.export', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                exercise_question.id,
              ])}
              isNextPage
              color="secondary"
            >
              Export Hasil Ujian Keseluruhan
            </MuiInertiaLinkButton>
            <MuiInertiaLinkButton
              href={route('packet.sub.category.exercise.leaderboard', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                exercise_question.id,
              ])}
              color="primary"
            >
              Leaderboard
            </MuiInertiaLinkButton>
          </div>
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
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
          }}
          renderRowActions={({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <MuiInertiaLinkButton
                href={route('packet.sub.category.exercise.exam.show', [
                  learning_packet_id,
                  sub_learning_packet_id,
                  learning_category_id,
                  exercise_question.id,
                  row.original.id,
                ])}
              >
                Evaluasi
              </MuiInertiaLinkButton>
              <MuiInertiaLinkButton
                href={route('packet.sub.category.exercise.exam.result', [
                  learning_packet_id,
                  sub_learning_packet_id,
                  learning_category_id,
                  exercise_question.id,
                  row.original.id,
                ])}
                color="success"
              >
                Lihat Hasil
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminShowLayout>
  );
}
