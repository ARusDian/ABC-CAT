import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { InertiaLink } from '@inertiajs/inertia-react';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';

interface Props {
  bank_questions: Array<BankQuestionModel>;
}

export default function Index({ bank_questions}: Props) {
  console.log(bank_questions)
  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    }
  ] as MRT_ColumnDef<BankQuestionModel>[];

  return (
    <AdminTableLayout
      title="Soal Latihan"
      addRoute={route('bank-question.create')}
    >
      <MaterialReactTable
        columns={dataColumns}
        data={bank_questions}
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
              href={route('bank-question.show', row.original.id)}
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
