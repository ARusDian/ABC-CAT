import InputError from '@/Components/Jetstream/InputError';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { ImportFileModel } from '@/Models/FileModel';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketModel } from '@/Models/UserLearningPacket';
import Api from '@/Utils/Api';
import { router } from '@inertiajs/react';
import { Button } from '@mui/material';
import { MRT_ColumnDef } from 'material-react-table';
import { useConfirm } from 'material-ui-confirm';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import route from 'ziggy-js';

interface Props {
  learningPackets: Array<LearningPacketModel>;
}

export default function Index({ learningPackets }: Props) {
  const confirm = useConfirm();

  const columns = [
    {
      header: 'Nama',
      accessorKey: 'user.name',
    },
    {
      header: 'Email',
      accessorKey: 'user.email',
    },
    {
      header: 'Tanggal Berlangganan',
      accessorFn: ({ subscription_date }: UserLearningPacketModel) =>
        new Date(subscription_date).toLocaleDateString(),
    },
  ] as MRT_ColumnDef<UserLearningPacketModel>[];

  return (
    <AdminTableLayout
      title="Langganan Paket Belajar Pengguna"
      addRoute={route('user-learning-packet.create')}
      addRouteTitle="Tambah Paket Belajar Pengguna"
    >
      <div className="flex flex-col gap-3">
        {learningPackets.length > 0 ? (
          learningPackets.map((learningPacket, Index) => {
            const form = useForm<ImportFileModel>();
            return (
              <div
                className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 w-full flex flex-col gap-3"
                key={Index}
              >
                <div className="flex justify-between">
                  <h1 className="text-2xl font-bold">
                    Paket Belajar {learningPacket.name}
                  </h1>
                  <MuiInertiaLinkButton
                    href={route('user-packet.users', {
                      learning_packet: learningPacket.id,
                    })}
                  >
                    Tambah Pengguna
                  </MuiInertiaLinkButton>
                </div>
                <div className="flex justify-between">
                  <MuiInertiaLinkButton
                    href={route('user-packet.export', learningPacket.id)}
                    color="primary"
                    isNextPage
                  >
                    Export Student
                  </MuiInertiaLinkButton>
                </div>
                <LazyLoadMRT
                  data={learningPacket.user_learning_packets ?? []}
                  columns={columns}
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
                    <div className="m-auto flex justify-center">
                      <Button
                        variant="contained"
                        color="error"
                        size="large"
                        onClick={() => {
                          confirm({
                            title: 'Hentikan Berlangganan',
                            description:
                              'Apakah anda yakin ingin menghentikan berlangganan?',
                            cancellationText: 'Batal',
                            confirmationText: 'Hentikan',
                          }).then(() => {
                            router.post(
                              route(
                                'user-learning-packet.destroy',
                                row.original.id,
                              ),
                              {
                                _method: 'DELETE',
                              },
                            );
                          });
                        }}
                      >
                        Hentikan Berlangganan
                      </Button>
                    </div>
                  )}
                />
              </div>
            );
          })
        ) : (
          <div className="flex justify-center">
            <p className="text-3xl font-bold my-auto">
              Belum ada paket belajar yang dibuat
            </p>
          </div>
        )}
      </div>
    </AdminTableLayout>
  );
}
