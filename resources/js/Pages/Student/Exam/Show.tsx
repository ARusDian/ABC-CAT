import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { InertiaLink } from '@inertiajs/inertia-react';
import Button from '@mui/material/Button';
import MaterialReactTable, { MRT_ColumnDef } from 'material-react-table';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
  exams: Model[];
}

type Model = ExamModel & {
  answers_sum_score: number;
  answers_count: number;
};

export default function Show(props: Props) {
  console.log(props.exams);

  const dataColumns = [
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
  ] as MRT_ColumnDef<Model>[];

  return (
    <DashboardLayout title={props.exercise_question.name}>
      <Button>
        <InertiaLink
          href={route('exam.attempt', [props.exercise_question.id])}
          method="POST"
          as="p"
        >
          Attempt
        </InertiaLink>
      </Button>

      <div>
        Attempt
        <MaterialReactTable
          columns={dataColumns}
          data={props.exams}
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
              <InertiaLink
                href={route('exam.show.attempt', [props.exercise_question.id, row.original.id])}
                className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
              >
                Show
              </InertiaLink>
            </div>
          )}
        />
        {/* {props.exams.map(it => { */}
        {/*   return ( */}
        {/*     <div key={it.id}> */}
        {/*       <div>{new Date(it.created_at).toLocaleString()}</div> */}
        {/*       <div> */}
        {/*       </div> */}
        {/*     </div> */}
        {/*   ); */}
        {/* })} */}
      </div>
    </DashboardLayout>
  );
}
