import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react'
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';

interface Props {
  items: Array<BankQuestionItemModel>;
}

export default function Index(props: Props) {
  const items = props.items;

  const dataColumns = [] as MRT_ColumnDef<BankQuestionItemModel>[];
  return (
    <AdminTableLayout
      title="Pertanyaan"
      addRoute={route('question.create')}
      addRouteTitle="Tambah Pertanyaan"
    >
      <MaterialReactTable
        columns={dataColumns}
        data={items}
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
              <Link href={route('question.show', row.original.id)}>
                Show
              </Link>
            </Button>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
