import useRoute from "@/Hooks/useRoute";
import AdminNestedShowLayout from "@/Layouts/Admin/AdminNestedShowLayout";
import AdminShowLayout from "@/Layouts/Admin/AdminShowLayout";
import { LearningCategoryModel } from "@/Models/LearningCategory";
import { Link, router, usePage } from "@inertiajs/react";
import { Button, Table } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React from "react";
import route from "ziggy-js";
import TableCard from "./TableCard";

interface Props {
    learningCategory: LearningCategoryModel
}

export default function Show({ learningCategory }: Props) {


    return (
        <AdminNestedShowLayout
            title="Kategori Belajar"
            headerTitle="Kategori Belajar"
            backRoute={route('learning-packet.show', {
                learning_packet: learningCategory.sub_learning_packet?.learning_packet_id ?? 0,
            })}
            editRoute={route('learning-packet.sub-learning-packet.edit', {
                learning_packet: learningCategory.sub_learning_packet?.learning_packet_id ?? 0,
                sub_learning_packet: learningCategory.sub_learning_packet_id,
                id: learningCategory.id
            })}
            editRouteTitle="Edit"
            onDelete={() => {
                router.delete(route('learning-packet.sub-learning-packet.destroy', {
                    learning_packet: learningCategory.sub_learning_packet?.learning_packet_id ?? 0,
                    sub_learning_packet: learningCategory.sub_learning_packet_id,
                    id: learningCategory.id
                }))
            }}
            deleteTitle="Hapus"
        >
            <div className="flex flex-col gap-3">
                <div className="m-8 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-5">
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
                                <td className="py-3 text-center">{learningCategory.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <TableCard
                    title="Materi Belajar"
                    createRoute="learning-packet.sub-learning-packet.learning-category.learning-material.create"
                    createRouteTitle="Tambah Materi"
                    columns={[
                        {
                            header: 'Judul',
                            accessorKey: 'title',
                        }
                    ]}
                    data={learningCategory.learning_materials ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.learning-material.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                />

                <TableCard
                    title="Bank Soal"
                    createRoute="learning-packet.sub-learning-packet.learning-category.bank-question.create"
                    createRouteTitle="Tambah Bank Soal"
                    columns={[
                        {
                            header: 'Nama',
                            accessorKey: 'name',
                        }
                    ]}
                    data={learningCategory.bank_questions ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.bank-question.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                />

                <TableCard
                    title="Latihan Soal"
                    createRoute="learning-packet.sub-learning-packet.learning-category.exercise-question.create"
                    createRouteTitle="Tambah Latihan Soal"
                    columns={[
                        {
                            header: 'Nama',
                            accessorKey: 'name',
                        }
                    ]}
                    data={learningCategory.exercise_questions ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.exercise-question.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                />

                {/* <MaterialReactTable
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
                                color="primary"
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
                /> */}
            </div>

        </AdminNestedShowLayout>
    )
}
