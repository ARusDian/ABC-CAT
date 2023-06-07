import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { InertiaLink } from '@inertiajs/inertia-react';
import { LearningMaterialModel } from '@/Models/LearningMaterial';
import AdminTableLayout from '@/Layouts/AdminTableLayout';
import { Button } from '@mui/material';

interface Props {
    learningMaterials: Array<LearningMaterialModel>,
}

export default function Index(props: Props) {
    const learningMaterials = props.learningMaterials;

    const dataColumns = [

    ] as MRT_ColumnDef<LearningMaterialModel>[];
    return (
        <AdminTableLayout
            title="Materi Belajar"
            addRoute={route('learning-material.create')}
            addRouteTitle="Tambah Materi Belajar"
        >
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
                        <Button
                            type="submit"
                            variant="contained"
                            color='primary'
                            size="large"
                        >
                            <InertiaLink href={route('learning-material.show', row.original.id)}>
                                Show
                            </InertiaLink>
                        </Button>
                    </div>
                )}
            />
        </AdminTableLayout>
    );
}
