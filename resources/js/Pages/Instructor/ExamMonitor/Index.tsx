import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { ExamModel } from '@/Models/Exam';
import { Button } from '@mui/material';

interface Props {
  exams: Array<ExamModel>;
}

export default function Index({ exams }: Props) {
  console.log(exams);
  const dataColumns = [
    {
      header: 'Nama User',
      accessorKey: 'user.name',
    },
    {
      header: 'Nama Soal Latihan',
      accessorKey: 'exercise_question.name',
    },
    {
      header: 'Type',
      accessorKey: 'exercise_question.type',
    },
    {
      header: 'Finished',
      accessorFn: row => `${row.finished == true}`,
    },
  ] as MRT_ColumnDef<ExamModel>[];

  return (
    <AdminTableLayout title="Monitor Exam">
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <MaterialReactTable
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
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >

                <Link
                  href={route('exam-monitor.show', row.original.id)}
                >
                  Show
                </Link>
              </Button>
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
