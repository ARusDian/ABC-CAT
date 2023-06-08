import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import { QuestionModel } from '@/Models/Question';
import AdminTableLayout from '@/Layouts/AdminTableLayout';
import { Button } from '@mui/material';

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
        renderRowActions={({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              <InertiaLink href={route('question.show', row.original.id)}>
                Show
              </InertiaLink>
            </Button>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
