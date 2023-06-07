import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import { LearningMaterialModel } from '@/Models/LearningMaterial';

interface Props {
    learningMaterials: Array<LearningMaterialModel>,
}

export default function Index(props: Props) {
    const learningMaterials = props.learningMaterials;

    const dataColumns = [

    ] as MRT_ColumnDef<LearningMaterialModel>[];
    return (
        <DashboardAdminLayout title="learningMaterials">
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
                    <div className="p-6 sm:px-20 bg-white border-b border-gray-200">
                        <div className="flex justify-between">
                            <div className="mt-8 text-2xl">
                                Materi Pembelajaran
                            </div>
                            <div className="">
                                <InertiaLink
                                    href={route('learning-material.create')}
                                    className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold">
                                    Tambah Materi
                                </InertiaLink>
                            </div>
                        </div>
                        <div className="mt-6 text-gray-500">
                            <MaterialReactTable
                                columns={dataColumns}
                                data={learningMaterials}
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
                                        <InertiaLink href={route('learning-material.show', row.original.id)}
                                            className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold">
                                            Show
                                        </InertiaLink>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardAdminLayout>
    );
}
