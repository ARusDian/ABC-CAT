import AdminNestedShowLayout from "@/Layouts/Admin/AdminNestedShowLayout";
import { LearningCategoryModel } from "@/Models/LearningCategory";
import { SubLearningPacketModel } from "@/Models/SubLearningPacket";
import { Link, router } from "@inertiajs/react";
import { Button } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import route from "ziggy-js";
import InventoryIcon from '@mui/icons-material/Inventory';

interface Props {
    subLearningPacket: SubLearningPacketModel
}

export default function Show({ subLearningPacket }: Props) {
    const dataColumns = [
        {
            Header: 'Nama',
            accessorKey: 'name',
        }
    ] as MRT_ColumnDef<LearningCategoryModel>[];

    return (
        <AdminNestedShowLayout
            title="Sub Paket Belajar"
            headerTitle="Sub Paket Belajar"
            backRoute={route('learning-packet.show', {
                learning_packet: subLearningPacket.learning_packet_id
            })}
            editRoute={route('learning-packet.sub-learning-packet.edit', {
                learning_packet: subLearningPacket.learning_packet_id,
                sub_learning_packet: subLearningPacket.id
            })}
            editRouteTitle="Edit"
            onDelete={() => {
                router.delete(route('learning-packet.sub-learning-packet.destroy', {
                    learning_packet: subLearningPacket.learning_packet_id,
                    sub_learning_packet: subLearningPacket.id
                }))
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
                        <span className="mx-2 text-gray-600"><InventoryIcon fontSize="large" /></span>Kategori Belajar
                    </p>
                    <MaterialReactTable
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
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="success"
                                    size="large"
                                >
                                    <Link
                                        href={route('learning-packet.sub-learning-packet.learning-category.create', {
                                            learning_packet: subLearningPacket.learning_packet_id,
                                            sub_learning_packet: subLearningPacket.id
                                        })}
                                    >
                                        Tambah Kategori Belajar
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
                                    <Link href={route('learning-packet.sub-learning-packet.learning-category.show', {
                                        learning_packet: subLearningPacket.learning_packet_id,
                                        sub_learning_packet: subLearningPacket.id,
                                        learning_category: row.original.id
                                    })}>
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
