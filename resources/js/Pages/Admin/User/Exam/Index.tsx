import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import { ExamModel } from '@/Models/Exam';
import { Button } from '@mui/material';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { User } from '@/types';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';

interface Props {
  user_data: User;
}

export default function Index({ user_data }: Props) {
  const exams = user_data.exams as ExamModel[];
  const dataColumns = [
    {
      header: 'Nama Latihan Soal',
      accessorKey: 'exercise_question.name',
    },
    {
      header: 'Jenis Latihan Soal',
      accessorKey: 'exercise_question.type',
    },
    {
      header: 'Nilai',
      accessorKey: 'answers_sum_score',
    },
    {
      header: 'Waktu Mulai',
      accessorFn: row => new Date(row.created_at).toLocaleString(),
    },
    {
      header: 'Waktu Selesai',
      accessorFn: row =>
        `${
          row.finished
            ? new Date(row.finished_at).toLocaleString()
            : 'Belum Selesai'
        }`,
    },
  ] as MRT_ColumnDef<ExamModel>[];

  return (
    <AdminShowLayout
      title={`Riwayat Ujian ${user_data.name}`}
      headerTitle={`Riwayat Ujian ${user_data.name}`}
      backRoute={route('user.show', [user_data.id])}
    >
      <div className="mt-6 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <div className="flex justify-between gap-1">
          <div className="text-lg">
            <p>
              <span className="font-bold">Nama:</span> {user_data.name}
            </p>
            <p>
              <span className="font-bold">Email:</span> {user_data.email}
            </p>
          </div>
          <MuiInertiaLinkButton
            href={route('user.export-result', [user_data.id])}
            isNextPage
            color="secondary"
          >
            Export Hasil Ujian Keseluruhan
          </MuiInertiaLinkButton>
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
                href={route('user.exam.show', [user_data.id, row.original.id])}
              >
                Evaluasi
              </MuiInertiaLinkButton>
              <MuiInertiaLinkButton
                color="success"
                href={route('user.exam.result', [
                  user_data.id,
                  row.original.id,
                ])}
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
