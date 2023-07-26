import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';

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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              <Link
                href={route('exercise-question.show', row.original.id)}
              >
                Show
              </Link>
            </Button>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
