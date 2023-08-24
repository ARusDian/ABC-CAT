import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { asset } from '@/Models/Helper';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { User } from '@/types';
import { usePage } from '@inertiajs/react';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  learning_packets: LearningPacketModel[];
}

export default function Index({ learning_packets }: Props) {

  const { props } = usePage();
  const user = props.user as unknown as User;
  
  const dataColumns = [
    {
      header: 'Nama',
      accessorFn(originalRow) {
        return (
          <div className="flex gap-3">
            <img
              className=" h-20 w-20 object-cover"
              src={
                originalRow.photo_path
                  ? asset('public', originalRow.photo_path)
                  : asset('root', 'assets/image/default-image.jpg')
              }
              alt={originalRow.name}
            />
            <p className="my-auto font-semibold">{originalRow.name}</p>
          </div>
        );
      },
    },
    {
      header: 'Deskripsi',
      accessorKey: 'description',
    },
    {
      header: "Aktif",
      accessorFn(originalRow) {
        return originalRow.deleted_at ? <span className='text-red-500'>Tidak Aktif</span> : <span className='text-green-500'>Aktif</span>;
      },
    }
  ] as MRT_ColumnDef<LearningPacketModel>[];

  return (
    <AdminTableLayout
      title="Paket Belajar"
      addRoute={route('packet.create')}
      addRouteTitle="Tambah Paket Belajar"
      isAdminOnlyAction
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
          columns={dataColumns}
          data={learning_packets}
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
                href={route('packet.show', row.original.id)}
              >
                Show
              </MuiInertiaLinkButton>
              {
                user.roles[0].name !== 'instructor' && (
                  <MuiInertiaLinkButton
                    color="success"
                    href={route('user-packet.users', {
                      learning_packet: row.original.id,
                    })}
                  >
                    Tambah Pengguna
                  </MuiInertiaLinkButton>
                )
              }
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
