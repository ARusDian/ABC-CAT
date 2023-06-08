import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import route from 'ziggy-js';

import AppLayout from '@/Layouts/DashboardAdminLayout';
import { User } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import AdminTableLayout from '@/Layouts/AdminTableLayout';
import { Button } from '@mui/material';

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
      <MaterialReactTable
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
        renderRowActions={({ row }) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              <InertiaLink href={route('user.show', row.original.id)}>
                Show
              </InertiaLink>
            </Button>
          </div>
        )}
      />
    </AdminTableLayout>
  );
}
