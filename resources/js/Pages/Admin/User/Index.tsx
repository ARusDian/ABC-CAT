import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import { User } from '@/types';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

interface Props {
  users: Array<User>;
}

export default function Index(props: Props) {
  const users = props.users;

  const dataColumns = [
    {
      accessorKey: 'name',
      header: 'Nama User',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone_number',
      header: 'Nomor Telepon',
    },
    {
      accessorKey: 'active_year',
      header: 'Tahun Aktif',
    },
    {
      accessorFn: (row: User) => row.roles.map(role => role.name).join(', '),
      header: 'Status',
    },
  ] as MRT_ColumnDef<(typeof users)[0]>[];
  return (
    <AdminTableLayout
      title="User"
      addRoute={route('user.create')}
      addRouteTitle="Tambah User"
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
          columns={dataColumns}
          data={users}
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
                href={route('user.show', row.original.id)}
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
