import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionModel } from '@/Models/BankQuestion';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
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
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <div className="flex my-3">
          <div className=" text-lg">
            <p>{bank_question.name}</p>
            <p>Type: {bank_question.type}</p>
          </div>
          <div className="flex place-content-end grow gap-2">
            <MuiInertiaLinkButton
              href={route('learning-packet.sub-learning-packet.learning-category.bank-question.item.create', [
                learning_packet,
                sub_learning_packet,
                learning_category,
                bank_question.id,
              ])}
              color="success"
            >
              Tambah Soal
            </MuiInertiaLinkButton>

            <MuiInertiaLinkButton
              href={route('learning-packet.sub-learning-packet.learning-category.exercise-question.import', [
                learning_packet,
                sub_learning_packet,
                learning_category,
                bank_question.id,
              ])}
              color="primary"
            >
              Buat Paket Soal
            </MuiInertiaLinkButton>
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
              <MuiInertiaLinkButton
                href={route('learning-packet.sub-learning-packet.learning-category.bank-question.item.show', [
                  learning_packet,
                  sub_learning_packet,
                  learning_category,
                  bank_question.id,
                  row.original.id,
                ])}
                color="primary"
              >
                Show
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminShowLayout >
  );
}
