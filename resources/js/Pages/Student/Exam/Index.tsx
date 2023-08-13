import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';

import React from 'react';
import route from 'ziggy-js';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { MRT_ColumnDef } from 'material-react-table';
import LinkButton from '@/Components/LinkButton';
import { LearningCategoryModel } from '@/Models/LearningCategory';
import LazyLoadMRT from '@/Components/LazyLoadMRT';

interface Props {
  learningCategory: LearningCategoryModel;
  exerciseQuestions: ExerciseQuestionModel[];
}

export default function Index({ learningCategory, exerciseQuestions }: Props) {
  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();

  const columns = [
    {
      header: 'Latihan Soal',
      accessorKey: 'name',
    },
    {
      header: 'Tipe Soal',
      accessorKey: 'type',
    },
    {
      header: 'Jumlah Soal',
      accessorKey: 'number_of_question',
    },
    {
      header: 'Waktu Pengerjaan',
      accessorFn(originalRow) {
        return originalRow.time_limit + ' menit';
      },
    },
  ] as MRT_ColumnDef<ExerciseQuestionModel>[];

  return (
    <DashboardLayout title="Daftar Materi">
      <div className="flex flex-col gap-5 mx-10">
        <div className="flex justify-between">
          <p className="text-5xl text-[#3A63F5] capitalize">
            Daftar Latihan Soal {learningCategory.name}
          </p>
          <LinkButton
            href={route('student.packet.show', learning_packet)}
            colorCode="#3A63F5"
            className="px-5 rounded-md"
          >
            Kembali
          </LinkButton>
        </div>
        <div className="flex flex-col gap-3">
          {exerciseQuestions.length > 0 ? (
            <LazyLoadMRT
              columns={columns}
              data={exerciseQuestions}
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
                  <LinkButton
                    href={route('student.exam.show', row.original.id)}
                    colorCode="#3A63F5"
                    className="px-5 rounded-md"
                  >
                    Lihat
                  </LinkButton>
                </div>
              )}
            />
          ) : (
            <div className="flex justify-center">
              <p className="text-3xl font-bold my-auto">Tidak Ada Materi</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
