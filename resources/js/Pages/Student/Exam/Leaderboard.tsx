import LazyLoadMRT from '@/Components/LazyLoadMRT';
import LinkButton from '@/Components/LinkButton';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { groupBy, maxBy } from 'lodash';
import { MRT_ColumnDef } from 'material-react-table';
import React, { useState } from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel & {
  };
    exams: ExamModel[];
}

export default function Leaderboard({ exercise_question, exams }: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, //customize the default page size
  });

  const sortedExam = React.useMemo(() => {
    return Object.values(groupBy(exams, it => it.user_id))
      .map(it => maxBy(it, it => it.answers_sum_score)!)
      .sort((a, b) => b.answers_sum_score - a.answers_sum_score);
  }, [JSON.stringify(exams)]);

  const dataColumns = [
    {
      header: 'Ranking',
      accessorFn: (it: ExamModel, index: number) =>
        pagination.pageIndex * pagination.pageSize + index + 1,
    },
    {
      header: 'User',
      accessorKey: 'user.name',
    },
    {
      header: 'Waktu Mulai',
      accessorFn: it => new Date(it.created_at).toLocaleString(),
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: it => new Date(it.finished_at).toLocaleString(),
    },
    {
      header: 'Skor',
      accessorFn: it => {
        return <div>{it.answers_sum_score}</div>;
      },
    },
  ] as MRT_ColumnDef<ExamModel>[];

  return (
    <DashboardLayout title="Leaderboard">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="font-5xl capitalize">
            <p className="text-5xl text-[#3A63F5]">
              Ranking {exercise_question.name}
            </p>
          </div>
          <LinkButton
            href={
              route('student.exam.show', {
                exercise_question: exercise_question.id,
              }) as string
            }
            colorCode="#3A63F5"
            className="px-5 rounded-md"
          >
            Kembali
          </LinkButton>
        </div>
        <div className="p-5 rounded-lg border overflow-hidden shadow-2xl sm:rounded-3xl flex flex-col gap-3 bg-white">
          <LazyLoadMRT
            columns={dataColumns}
            data={sortedExam}
            enableColumnActions
            enableColumnFilters
            enablePagination
            enableSorting
            enableBottomToolbar
            enableTopToolbar
            muiTableBodyRowProps={{ hover: true }}
            state={{ pagination }}
            onPaginationChange={setPagination}
            initialState={{ pagination: { pageIndex: 0, pageSize: 10 } }}
            muiTableHeadCellProps={{
              sx: {
                fontWeight: 'bold',
                fontSize: '16px',
              },
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
