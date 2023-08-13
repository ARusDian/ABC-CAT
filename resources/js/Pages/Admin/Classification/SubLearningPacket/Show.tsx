import { LearningCategoryModel } from '@/Models/LearningCategory';
import { SubLearningPacketModel } from '@/Models/SubLearningPacket';
import { router } from '@inertiajs/react';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';
import InventoryIcon from '@mui/icons-material/Inventory';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

interface Props {
  subLearningPacket: SubLearningPacketModel;
}

export default function Show({ subLearningPacket }: Props) {
  const dataColumns = [
    {
      Header: 'Nama',
      accessorKey: 'name',
    },
  ] as MRT_ColumnDef<LearningCategoryModel>[];

  return (
    <AdminShowLayout
      title="Sub Paket Belajar"
      headerTitle="Sub Paket Belajar"
      backRoute={route('packet.show', {
        learning_packet: subLearningPacket.learning_packet_id,
      })}
      editRoute={route('packet.sub.edit', {
        learning_packet: subLearningPacket.learning_packet_id,
        sub_learning_packet: subLearningPacket.id,
      })}
      editRouteTitle="Edit"
      onDelete={() => {
        router.delete(
          route('packet.sub.destroy', {
            learning_packet: subLearningPacket.learning_packet_id,
            sub_learning_packet: subLearningPacket.id,
          }),
        );
      }}
      deleteTitle="Hapus"
    >
      <div className="flex flex-col gap-5">
        <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
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
                <td className="py-3 text-center">{subLearningPacket.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">
          <p className="text-xl font-semibold">
            <span className="mx-2 text-gray-600">
              <InventoryIcon fontSize="large" />
            </span>
            Kategori Belajar
          </p>
          <LazyLoadMRT
            columns={dataColumns}
            data={subLearningPacket.learning_categories ?? []}
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
            renderTopToolbarCustomActions={() => (
              <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                  color="success"
                  href={route('packet.sub.category.create', {
                    learning_packet: subLearningPacket.learning_packet_id,
                    sub_learning_packet: subLearningPacket.id,
                  })}
                >
                  Tambah Kategori Belajar
                </MuiInertiaLinkButton>
              </div>
            )}
            renderRowActions={({ row }) => (
              <div className="flex items-center justify-center gap-2">
                <MuiInertiaLinkButton
                  color="primary"
                  href={route('packet.sub.category.show', {
                    learning_packet: subLearningPacket.learning_packet_id,
                    sub_learning_packet: subLearningPacket.id,
                    learning_category: row.original.id,
                  })}
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
