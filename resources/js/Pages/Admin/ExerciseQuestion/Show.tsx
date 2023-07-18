import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { QuestionModel } from '@/Models/Question';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Button } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Show(props: Props) {
  const { exercise_question } = props;
  const dataColumns = [
    {
      header: 'Nama',
      // accessorKey:
      // accessorKey: 'name',
    },
  ] as MRT_ColumnDef<QuestionModel>[];

  return (
    <AdminShowLayout
      title="Latihan Soal"
      headerTitle="Data Latihan Soal"
      editRoute={route('exercise-question.edit', exercise_question.id)}
      backRoute={route('exercise-question.index')}
    >
      <div className="flex justify-between">
        <div className=" text-lg">
          <p>{exercise_question.name}</p>
          <p>Type: {exercise_question.type}</p>
          <p>
            Batas waktu:{' '}
            <span className="font-semibold">
              {parseFloat(exercise_question.time_limit.toFixed(2))}
            </span>{' '}
            Menit
          </p>
        </div>
        <InertiaLink
          href={route(
            'exercise-question.question.create',
            exercise_question.id,
          )}
        >
          <Button variant="contained" color="primary" size="large">
            Tambah Soal
          </Button>
        </InertiaLink>
      </div>
      <MaterialReactTable
        columns={dataColumns}
        data={exercise_question.questions ?? []}
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
            <InertiaLink
              href={route('exercise-question.question.show', [
                exercise_question.id,
                row.original.id,
              ])}
              className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
            >
              Show
            </InertiaLink>
          </div>
        )}
      />
    </AdminShowLayout>
  );
}
