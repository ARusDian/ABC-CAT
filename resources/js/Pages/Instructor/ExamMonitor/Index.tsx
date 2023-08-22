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

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Index({ exercise_question }: Props) {
  const exams = exercise_question.exams as ExamModel[];
  console.log(exercise_question);
  const dataColumns = [
    {
      header: 'Nama User',
      accessorKey: 'user.name',
    },
    {
      header: 'Waktu Selesai',
      accessorFn: row => `${row.finished ? new Date(row.finished_at).toLocaleString() : 'Belum Selesai'}`,
    },
  ] as MRT_ColumnDef<ExamModel>[];

  const {
    learning_packet_id,
    sub_learning_packet_id,
    learning_category_id
  } =
    useDefaultClassificationRouteParams();

  return (
    <AdminShowLayout
      title="Monitor Exam"
      headerTitle='Monitor Ujian'
      backRoute={route('packet.sub.category.exercise.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exercise_question.id,
      ])}
    >
      <div className="mt-6 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <div className='flex flex-col gap-1'>
          <p>{exercise_question.name}</p>
          <p>Tipe: {exercise_question.type}</p>
          <p>
            Batas waktu:{' '}
            {
              <span className="font-semibold">
                {parseFloat(exercise_question.time_limit.toFixed(2))}
              </span>
            }{' '}
            Menit
          </p>
          <p>Jumlah Soal Per Latihan: {exercise_question.number_of_question}</p>
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                <Link href={route('packet.sub.category.exercise.exam-monitor.show', [
                  learning_packet_id,
                  sub_learning_packet_id,
                  learning_category_id,
                  exercise_question.id,
                  row.original.id
                ])}>
                  Show
                </Link>
              </Button>
            </div>
          )}
        />
      </div>
    </AdminShowLayout>
  );
}
