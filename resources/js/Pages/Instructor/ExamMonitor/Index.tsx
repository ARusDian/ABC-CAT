import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { InertiaLink } from '@inertiajs/inertia-react';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { ExamModel } from '@/Models/Exam';

interface Props {
  exams: Array<ExamModel>;
}

export default function Index({ exams}: Props) {
  console.log(exams)
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
      accessorFn: row => `${row.finished == true}`
    }
  ] as MRT_ColumnDef<ExamModel>[];

  return (
    <AdminTableLayout
      title="Monitor Exam"
    >
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
            <InertiaLink
              href={route('exam-monitor.show', row.original.id)}
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
