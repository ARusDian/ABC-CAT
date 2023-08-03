import  { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

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
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
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
              <MuiInertiaLinkButton
                color="primary"
                href={route('question.show', row.original.id)}
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
