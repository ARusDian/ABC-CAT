import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import { QuestionModel } from '@/Models/Question';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';

interface Props {
  questions: Array<QuestionModel>;
}

export default function Index(props: Props) {
  const questions = props.questions;

  const dataColumns = [] as MRT_ColumnDef<QuestionModel>[];
  return (
    <AdminTableLayout
      title="Pertanyaan"
      addRoute={route('question.create')}
      addRouteTitle="Tambah Pertanyaan"
    >
      <MaterialReactTable
        columns={dataColumns}
        data={questions}
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
              href={route('question.show', row.original.id)}
            >
              Show
            </MuiInertiaLinkButton>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
