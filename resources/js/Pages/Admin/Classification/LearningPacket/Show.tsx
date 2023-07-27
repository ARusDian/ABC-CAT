import AdminNestedShowLayout from "@/Layouts/Admin/AdminNestedShowLayout";
import { LearningPacketModel } from "@/Models/LearningPacket";
import { SubLearningPacketModel } from "@/Models/SubLearningPacket";
import { Link, router } from "@inertiajs/react";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import route from "ziggy-js";
import FolderIcon from '@mui/icons-material/Folder';

interface Props {
    learningPacket: LearningPacketModel
}

export default function Show({ learningPacket }: Props) {
    const dataColumns = [
        {
            Header: 'Nama',
            accessorKey: 'name',
        }
    ] as MRT_ColumnDef<SubLearningPacketModel>[];

    return (
        <AdminNestedShowLayout
            title="Paket Belajar"
            headerTitle="Paket Belajar"
            backRoute={route('learning-packet.index')}
            editRoute={route('learning-packet.edit', learningPacket.id)}
            editRouteTitle="Edit"
            onDelete={() => {
                router.delete(route('learning-packet.destroy', learningPacket.id))
            }}
            deleteTitle="Hapus"
        >
            <div className="flex flex-col gap-5">
                <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">

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
                                <td className="py-3 text-center">{learningPacket.name}</td>
                            </tr>
                            <tr className="border-b py-3 border-black">
                                <td className="py-3 text-center">Deskripsi</td>
                                <td className="py-3 text-center">{learningPacket.description}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">
                    <p className="text-xl font-semibold">
                        <span className="mx-2 text-gray-600"><FolderIcon fontSize="large" /></span>Sub Paket Belajar
                    </p>
                    <MaterialReactTable
                        columns={dataColumns}
                        data={learningPacket.sub_learning_packets}
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
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="success"
                                    size="large"
                                >
                                    <Link
                                        href={route('learning-packet.sub-learning-packet.create', {
                                            learning_packet: learningPacket.id
                                        })}
                                    >
                                        Tambah Sub Paket Belajar
                                    </Link>
                                </Button>
                            </div>
                        )}
                        renderRowActions={({ row }) => (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    <Link href={route('learning-packet.sub-learning-packet.show', [
                                        learningPacket.id,
                                        row.original.id
                                    ])}>
                                        Show
                                    </Link>
                                </Button>
                            </div>
                        )}
                    />
                </div>
            </div>
        </AdminNestedShowLayout>
    )
}
