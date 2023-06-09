import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import { QuestionModel } from '@/Models/Question';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import AdminTableLayout from '@/Layouts/AdminTableLayout';

interface Props {
  exercise_questions: Array<ExerciseQuestionModel>;
}

export default function Index({ exercise_questions }: Props) {
  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
  ] as MRT_ColumnDef<ExerciseQuestionModel>[];

  return (
    <AdminTableLayout
      title="Soal Latihan"
      addRoute={route('exercise-question.create')}
    >
      <MaterialReactTable
        columns={dataColumns}
        data={exercise_questions}
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
              href={route('exercise-question.show', row.original.id)}
              className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
            >
              Show
            </InertiaLink>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
