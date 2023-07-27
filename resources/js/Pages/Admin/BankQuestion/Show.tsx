import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { Link } from '@inertiajs/react';
import { Button } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  bank_question: BankQuestionModel;
}

export default function Show(props: Props) {
  const { bank_question } = props;

  const {
    learning_packet,
    sub_learning_packet,
    learning_category,
  } = useDefaultClassificationRouteParams();

  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    }, {
      header: 'type',
      accessorKey: 'type',
    }, {
      header: 'Bobot',
      accessorKey: 'weight',
    }, {
      header: 'Status',
      accessorFn: (row) => {
        return row.is_active ? 'Aktif' : 'Tidak Aktif';
      }
    }
  ] as MRT_ColumnDef<BankQuestionItemModel>[];

  return (
    <AdminShowLayout
      title="Bank Soal"
      headerTitle="Data Bank Soal"
      editRoute={route('learning-packet.sub-learning-packet.learning-category.bank-question.edit', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        bank_question.id,
      ])}
      backRoute={route('learning-packet.sub-learning-packet.learning-category.show', [
        learning_packet,
        sub_learning_packet,
        learning_category
      ])}
    >
      <div className="flex my-3">
        <div className=" text-lg">
          <p>{bank_question.name}</p>
          <p>Type: {bank_question.type}</p>
        </div>
        <div className="flex place-content-end grow gap-2">
          <Link href={route('learning-packet.sub-learning-packet.learning-category.bank-question.item.create', [
            learning_packet,
            sub_learning_packet,
            learning_category,
            bank_question.id,
          ])}>
            <Button variant="contained" color="success" size="large">
              Tambah Soal
            </Button>
          </Link>

          <Link href={route('learning-packet.sub-learning-packet.learning-category.exercise-question.import', [
            learning_packet,
            sub_learning_packet,
            learning_category,
            bank_question.id,
          ])}>
            <Button variant="contained" color="primary" size="large">
              Buat Paket Soal
            </Button>
          </Link>
        </div>
      </div>
      <MaterialReactTable
        columns={dataColumns}
        data={bank_question.items ?? []}
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
            <Link
              href={route('learning-packet.sub-learning-packet.learning-category.bank-question.item.show', [
                learning_packet,
                sub_learning_packet,
                learning_category,
                bank_question.id,
                row.original.id,
              ])}
              className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
            >
              Show
            </Link>
          </div>
        )}
      />
    </AdminShowLayout>
  );
}
