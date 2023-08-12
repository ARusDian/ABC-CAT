import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import { User } from '@/types';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import { asset } from '@/Models/Helper';
import { Controller, useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { BaseDocumentFileModel } from '@/Models/FileModel';
import { Button } from '@mui/material';

interface Props {
  users: Array<User>;
}

interface ImportFileModel {
  import_file: BaseDocumentFileModel
}


export default function Index(props: Props) {
  const users = props.users;

  const form = useForm<ImportFileModel>();

  function onSubmit(e: any) {
    Api.post(route('user.import'), e, form);
  }

  const dataColumns = [
    {
      header: 'Nama User',
      accessorFn(originalRow) {
        return (
          <div className='flex gap-3'>
            <img
              className="rounded-full h-20 w-20 object-cover"
              src={originalRow.profile_photo_path ? asset('public', originalRow.profile_photo_path) : asset('root', 'assets/image/default-profile.png')}
              alt={originalRow.name}
            />
            <p className='my-auto font-semibold'>{originalRow.name}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: 'Email',
    }, {
      accessorKey: 'phone_number',
      header: 'Nomor Telepon',
    }, {
      accessorKey: 'active_year',
      header: 'Tahun Aktif',
    }, {
      header: 'Aktif',
      accessorFn: (row) => row.deleted_at ?
        <p className="text-red-500">
          Tidak Aktif
        </p> : <p className="text-green-500">
          Aktif
        </p>,
    }, {
      accessorFn: (row: User) => row.roles.map(role => role.name).join(', '),
      header: 'Status',
    }
  ] as MRT_ColumnDef<(typeof users)[0]>[];
  return (
    <AdminTableLayout
      title="User"
      addRoute={route('user.create')}
      addRouteTitle="Tambah User"
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <div className='flex justify-between'>
          <div className="flex justify-center">
            <form
              className="flex-col gap-5 py-5"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex justify-end gap-3">
                <Controller
                  name="import_file"
                  control={form.control}
                  render={({ field }) => (
                    <input
                      type="file"
                      ref={field.ref}
                      className=""
                      onChange={e => {
                        field.onChange({
                          file: e.target.files![0],
                          path: "",
                          disk: 'public',
                        });
                      }}
                    />
                  )}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  color="success"
                >
                  Import Student
                </Button>
                <MuiInertiaLinkButton
                  href={route('user.import-template')}
                  color="secondary"
                  isNextPage
                >
                  Template
                </MuiInertiaLinkButton>
              </div>
            </form>
          </div>
          <MuiInertiaLinkButton
            href={route('user.export')}
            color="primary"
            isNextPage
          >
            Export Student
          </MuiInertiaLinkButton>
        </div>
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
