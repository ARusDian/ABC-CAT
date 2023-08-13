import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

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
    <AdminTableLayout title="Soal Latihan" addRoute={route('exercise.create')}>
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
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
                <Link href={route('exercise.show', row.original.id)}>Show</Link>
              </Button>
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
