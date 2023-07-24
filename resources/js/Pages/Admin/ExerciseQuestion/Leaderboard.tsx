import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { ExamAnswerModel, ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { groupBy, maxBy } from 'lodash';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';

interface Props {
  exercise_question: ExerciseQuestionModel & {
    exams: ExamModel[];
  };
}

export default function Leaderboard(props: Props) {
  console.log(props.exercise_question);

  const sortedExam = React.useMemo(() => {
    return Object.values(
      groupBy(props.exercise_question.exams, it => it.user_id),
    )
      .map(it => maxBy(it, it => it.answers_sum_score)!)
      .sort((a, b) => a.answers_sum_score - b.answers_sum_score);
    // return props.exercise_question.exams.slice().sort((a,b) => a.:A)
  }, [props.exercise_question.exams]);

  const dataColumns = [
    {header: 'User', accessorKey: 'user.name'},
    {
      header: 'Waktu Mulai',
      accessorFn: it => (new Date(it.created_at)).toLocaleString()
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: it => (new Date(it.finished_at)).toLocaleString(),
    },
    {
      header: 'Score',
      accessorFn: it => {
        return (
          <div>
            {parseFloat(it.answers_sum_score.toString())}/{it.answers_count} (
            {(it.answers_sum_score * 100) / it.answers_count}%)
          </div>
        );
      },
    },
  ] as MRT_ColumnDef<ExamModel>[];
  console.log(sortedExam);

  return (
    <AdminTableLayout title="Leaderboard">
        <MaterialReactTable
          columns={dataColumns}
          data={sortedExam}
          enableColumnActions
          enableColumnFilters
          enablePagination
          enableSorting
          enableBottomToolbar
          enableTopToolbar
          enableRowActions
          enableRowNumbers
          muiTableBodyRowProps={{ hover: false }}
          // renderRowActions={({ row }) => (
          //   <div className="flex items-center justify-center gap-2">
          //     <InertiaLink
          //       href={route('exam.show.attempt', [props.exercise_question.id, row.original.id])}
          //       className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
          //     >
          //       Show
          //     </InertiaLink>
          //   </div>
          // )}
        />
    </AdminTableLayout>
  );
}
