import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Show(props: Props) {
  const { exercise_question } = props;
  const dataColumns = [
    {
      header: 'Nama',
      accessorKey: 'name',
    },
  ] as MRT_ColumnDef<BankQuestionItemModel>[];

  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  return (
    <AdminShowLayout
      title="Latihan Soal"
      headerTitle="Data Latihan Soal"
      editRoute={route('packet.sub.category.exercise.edit', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exercise_question.id,
      ])}
      backRoute={route('packet.sub.category.show', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
      ])}
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className=" text-lg">
            <p>{exercise_question.name}</p>
            <p>Tipe: {exercise_question.type}</p>
            <p>
              Batas waktu{exercise_question.type === "Kecermatan" ? " per Kolom : " : ": "}
              {
                <span className="font-semibold">
                  {parseFloat(exercise_question.time_limit.toFixed(2))}
                </span>
              }{' '}
              Menit
            </p>
            <p>
              Jumlah Soal {exercise_question.type === "Kecermatan" ? "per Kolom" : "Per Latihan"}: {exercise_question.number_of_question}
            </p>
            <p
              className={`${exercise_question.deleted_at ? 'text-red-500' : 'text-green-500'
                } font-semibold`}
            >
              Status : {exercise_question.deleted_at ? 'Nonaktif' : 'Aktif'}
            </p>
          </div>
          <div className="flex justify-around my-auto gap-5">
            <MuiInertiaLinkButton
              color="secondary"
              href={route('packet.sub.category.exercise.exam-monitor.index', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                exercise_question.id,
              ])}
            >
              Monitoring Ujian
            </MuiInertiaLinkButton>
            <MuiInertiaLinkButton
              color="primary"
              href={route('packet.sub.category.exercise.exam', [
                learning_packet_id,
                sub_learning_packet_id,
                learning_category_id,
                exercise_question.id,
              ])}
            >
              Riwayat Pengerjaan
            </MuiInertiaLinkButton>
          </div>
        </div>
        <LazyLoadMRT
          columns={dataColumns}
          data={exercise_question.questions ?? []}
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
              <MuiInertiaLinkButton
                href={route('packet.sub.category.exercise.question.show', [
                  learning_packet_id,
                  sub_learning_packet_id,
                  learning_category_id,
                  exercise_question.id,
                  row.original.id,
                ])}
              >
                Show
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminShowLayout>
  );
}
