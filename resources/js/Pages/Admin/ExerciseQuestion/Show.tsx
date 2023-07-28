import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { Link } from '@inertiajs/react';
import { Button } from '@mui/material';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
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

  const {
    learning_packet,
    sub_learning_packet,
    learning_category,
  } = useDefaultClassificationRouteParams();

  return (
    <AdminShowLayout
      title="Latihan Soal"
      headerTitle="Data Latihan Soal"
      editRoute={route('learning-packet.sub-learning-packet.learning-category.exercise-question.edit', [
        learning_packet,
        sub_learning_packet,
        learning_category,
        exercise_question.id,
      ])}
      backRoute={route('learning-packet.sub-learning-packet.learning-category.show', [
        learning_packet,
        sub_learning_packet,
        learning_category,
      ])}
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <div className="flex justify-between">
          <div className=" text-lg">
            <p>{exercise_question.name}</p>
            <p>Type: {exercise_question.type}</p>
            <p>
              Batas waktu:{' '}
              {
                <span className="font-semibold">
                  {parseFloat(exercise_question.time_limit.toFixed(2))}
                </span>
              }{' '}
              Menit
            </p>
          </div>
          <div className="flex justify-around my-auto gap-5">
            <MuiInertiaLinkButton
              color="success"
              href={route(
                'learning-packet.sub-learning-packet.learning-category.exercise-question.question.create',
                [
                  learning_packet,
                  sub_learning_packet,
                  learning_category,
                  exercise_question.id,
                ]
              )}
            >
              Tambah Soal
            </MuiInertiaLinkButton>
            <MuiInertiaLinkButton
              color="primary"
              href={route(
                'learning-packet.sub-learning-packet.learning-category.exercise-question.leaderboard',
                [
                  learning_packet,
                  sub_learning_packet,
                  learning_category,
                  exercise_question.id,
                ],
              )}
            >
              Leaderboard
            </MuiInertiaLinkButton>
          </div>
        </div>
        <MaterialReactTable
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
                href={route('learning-packet.sub-learning-packet.learning-category.exercise-question.question.show', [
                  learning_packet,
                  sub_learning_packet,
                  learning_category,
                  exercise_question.id,
                  row.original.id,
                ])}
              >
                Show
              </MuiInertiaLinkButton>
              <MuiInertiaLinkButton
                href={route('learning-packet.sub-learning-packet.learning-category.exercise-question.question.destroy', [
                  learning_packet,
                  sub_learning_packet,
                  learning_category,
                  exercise_question.id,
                  row.original.id,
                ])}
              >
                Hapus
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminShowLayout>
  );
}
