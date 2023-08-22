import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { SubLearningPacketModel } from '@/Models/SubLearningPacket';
import { Link, router } from '@inertiajs/react';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import FolderIcon from '@mui/icons-material/Folder';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import { asset } from '@/Models/Helper';

interface Props {
  learning_packet: LearningPacketModel;
}

export default function Show({ learning_packet }: Props) {
  const dataColumns = [
    {
      Header: 'Nama',
      accessorKey: 'name',
    },
  ] as MRT_ColumnDef<SubLearningPacketModel>[];

  let editProps = {};

  if (!learning_packet.deleted_at) {
    editProps = {
      editRoute: route('packet.edit', learning_packet.id),
      editRouteTitle: 'Edit',
    };
  }

  return (
    <AdminShowLayout
      title="Paket Belajar"
      headerTitle="Paket Belajar"
      backRoute={route('packet.index')}
      {...editProps}
      isRestore={learning_packet.deleted_at ? true : false}
      onDelete={() => {
        learning_packet.deleted_at
          ? router.post(route('packet.restore', [learning_packet.id]))
          : router.delete(route('packet.destroy', [learning_packet.id]));
      }}
      deleteTitle={learning_packet.deleted_at ? 'Restore' : 'Hapus'}
      onDeleteMessage={
        learning_packet.deleted_at
          ? `Ini akan mengembalikan Akun ${learning_packet.name}`
          : `Ini akan menghapus Akun ${learning_packet.name}`
      }
    >
      <div className="flex flex-col gap-5">
        <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">
          <div className='flex justify-center'>
            <img
              className="w-40 h-40"
              src={learning_packet.photo_path
                ? asset('public', learning_packet.photo_path)
                : asset('root', 'assets/image/default-image.jpg')}
              alt={learning_packet.name}
            />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b py-3 border-black">
                <th className="">Properti</th>
                <th className="">Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b py-3 border-black">
                <td className="py-3 text-center">Nama</td>
                <td className="py-3 text-center">{learning_packet.name}</td>
              </tr>
              <tr className="border-b py-3 border-black">
                <td className="py-3 text-center">Deskripsi</td>
                <td className="py-3 text-center">
                  {learning_packet.description}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">
          <p className="text-xl font-semibold">
            <span className="mx-2 text-gray-600">
              <FolderIcon fontSize="large" />
            </span>
            Sub Paket Belajar
          </p>
          <LazyLoadMRT
            columns={dataColumns}
            data={learning_packet.sub_learning_packets}
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
            renderDetailPanel={({ row }) => {
              return (
                <div className="flex flex-col gap-5 max-w-7xl mx-auto">
                  {row.original.learning_categories &&
                  row.original.learning_categories?.length > 0 ? (
                    row.original.learning_categories?.map((category, i) => (
                      <Link
                        className="px-3 py-3 rounded-lg bg-[#77c3f9] hover:bg-[#3da5f5] transition duration-300 ease-in-out"
                        href={route('packet.sub.category.show', [
                          learning_packet.id,
                          row.original.id,
                          category.id,
                        ])}
                      >
                        <p className="text-md font-semibold">
                          <span className="mx-3">{i + 1}.</span>
                          {category.name}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="flex flex-col gap-2 p-3">
                      <p className="text-md font-semibold">
                        Tidak ada kategori
                      </p>
                    </div>
                  )}
                </div>
              );
            }}
            renderTopToolbarCustomActions={() => (
              <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                  color="success"
                  href={route('packet.sub.create', learning_packet.id)}
                >
                  Tambah Sub Paket Belajar
                </MuiInertiaLinkButton>
              </div>
            )}
            renderRowActions={({ row }) => (
              <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                  color="primary"
                  href={route('packet.sub.show', [
                    learning_packet.id,
                    row.original.id,
                  ])}
                >
                  Show
                </MuiInertiaLinkButton>
              </div>
            )}
          />
        </div>
      </div>
    </AdminShowLayout>
  );
}
