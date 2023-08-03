import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

interface Props {
  bank_questions: Array<BankQuestionModel>;
}

export default function Index({ bank_questions }: Props) {
  console.log(bank_questions);
  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
    {
      header: 'Type',
      accessorKey: 'type',
    },
  ] as MRT_ColumnDef<BankQuestionModel>[];

  return (
    <AdminTableLayout
      title="Soal Latihan"
      addRoute={route('bank-question.create')}
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
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
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
          }}
          renderRowActions={({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <MuiInertiaLinkButton
                color="primary"
                href={route('bank-question.show', row.original.id)}
              >
                Show
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
