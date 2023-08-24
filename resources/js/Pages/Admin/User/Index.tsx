import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import { User } from '@/types';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import { asset } from '@/Models/Helper';
import { Controller, useForm } from 'react-hook-form';
import Api from '@/Utils/Api';
import { ImportFileModel } from '@/Models/FileModel';
import { Button } from '@mui/material';
import { router } from '@inertiajs/react';
import InputError from '@/Components/Jetstream/InputError';
import ReactLoading from 'react-loading';

interface Props {
  users: {
    data: User[];
    per_page: number;
    total: number;
    current_page: number;
  }
}

export default function Index(props: Props) {
  const users = props.users;

  const [dataState, setDataState] = React.useState(users.data);
  const [columnFilters, setColumnFilters] =
    React.useState<MRT_ColumnFiltersState>([]);

  const [pagination, setPagination] = React.useState<MRT_PaginationState>({
    pageIndex: users.current_page - 1,
    pageSize: users.per_page,
  });

  const [isLoading, setIsLoading] = React.useState(false);


  React.useEffect(() => {
    const url = new URL(route(route().current()!).toString());

    url.searchParams.set('columnFilters', JSON.stringify(columnFilters ?? []));
    url.searchParams.set('page', (pagination.pageIndex + 1).toString());
    url.searchParams.set('perPage', pagination.pageSize.toString());
    // url.searchParams.set('globalFilter', globalFilter ?? '');

    if (window.location.href == url.toString()) {
      return;
    }

    setIsLoading(true);
    router.reload({
      // preserveState: true,
      // preserveScroll: true,
      data: {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        columnFilters: JSON.stringify(columnFilters),
        // globalFilter: globalFilter,
      },
      only: ['activities'],
      onFinish: () => {
        setIsLoading(false);
      },
    });
  }, [pagination.pageIndex, pagination.pageSize, columnFilters]);


  const form = useForm<ImportFileModel>();

  function onSubmit(e: any) {
    Api.post(route('user.import'), e, form);
  }

  const dataColumns = [
    {
      id: 'name',
      header: 'Nama User',
      accessorFn: (row) => row.name,
      Cell: ({ renderedCellValue, row }) => (
        <div className="flex gap-3">
          <img
            className="rounded-full h-20 w-20 object-cover"
            src={
              row.original.profile_photo_path
                ? asset('public', row.original.profile_photo_path)
                : asset('root', 'assets/image/default-profile.png')
            }
            alt={`${row.original.name} profile photo}`}
          />
          <p className="my-auto font-semibold">{renderedCellValue}</p>
        </div>
      ),
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
      header: 'Aktif',
      accessorFn: row =>
        row.deleted_at ? (
          <p className="text-red-500">Tidak Aktif</p>
        ) : (
          <p className="text-green-500">Aktif</p>
        ),
    },
    {
      accessorFn: (row: User) => row.roles.map(role => role.name).join(', '),
      header: 'Status',
    },
  ] as MRT_ColumnDef<User>[];
  return (
    <AdminTableLayout
      title="User"
      addRoute={route('user.create')}
      addRouteTitle="Tambah User"
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <div className="flex justify-between">
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
                    <div>
                      <input
                        type="file"
                        ref={field.ref}
                        className=""
                        required
                        onChange={e => {
                          field.onChange({
                            file: e.target.files![0],
                            path: '',
                            disk: 'public',
                          });
                        }}
                      />
                      <InputError
                        message={form.formState.errors.import_file?.message}
                        className="mt-2"
                      />
                    </div>
                  )}
                />
                <div className='my-auto'>
                  {form.formState.isSubmitting ? (
                    <ReactLoading color="#1964AD" type="spin" />
                  ) : (
                    <div className='my-auto'>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        color="success"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? 'Importing...' : 'Import Student'}
                      </Button>
                    </div>
                  )}
                </div>
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
          data={users.data}
          enableGlobalFilter={false}
          enableColumnActions
          enableColumnFilters
          enablePagination
          enableSorting
          enableBottomToolbar
          enableTopToolbar
          enableRowActions
          enableRowNumbers
          muiTableBodyRowProps={{ hover: false }}
          state={{
            pagination,
            isLoading,
            columnFilters,
          }}
          getRowId={(it) => it.id?.toString()}
          manualPagination
          onPaginationChange={setPagination}
          onColumnFiltersChange={setColumnFilters}
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
    </AdminTableLayout >
  );
}
