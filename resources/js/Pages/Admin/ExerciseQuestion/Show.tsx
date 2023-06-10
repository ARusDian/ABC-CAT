import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { QuestionModel } from '@/Models/Question';
import { InertiaLink } from '@inertiajs/inertia-react';
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
      {exercise_question.name}

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
              href={route('exercise-question.question.show', [exercise_question.id, row.original.id])}
              className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
            >
              Show
            </InertiaLink>
          </div>
        )}
      />
      <InertiaLink
        href={route('exercise-question.question.create', exercise_question.id)}
      >
        Add
      </InertiaLink>
    </AdminShowLayout>
  );
}
