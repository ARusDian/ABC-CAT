import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

import { Link } from '@inertiajs/react';
import { LearningMaterialModel } from '@/Models/LearningMaterial';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { Button } from '@mui/material';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

interface Props {
  learning_materials: Array<LearningMaterialModel>;
}

export default function Index(props: Props) {
  const learningMaterials = props.learning_materials;

  const dataColumns = [] as MRT_ColumnDef<LearningMaterialModel>[];
  return (
    <AdminTableLayout
      title="Materi Belajar"
      addRoute={route('learning-material.create')}
      addRouteTitle="Tambah Materi Belajar"
    >
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
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
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
          }}
          renderRowActions={({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                <Link href={route('learning-material.show', row.original.id)}>
                  Show
                </Link>
              </Button>
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
