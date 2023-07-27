import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { Button } from '@mui/material';

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
              <Link
                href={route('bank-question.show', row.original.id)}
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
