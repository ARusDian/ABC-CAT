import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { groupBy, maxBy } from 'lodash';
import { MRT_ColumnDef } from 'material-react-table';
import React, { useState, useEffect } from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel & {
    exams: ExamModel[];
  };
}

export default function Leaderboard({ exercise_question }: Props) {
  const [data, setData] = useState<ExamModel[]>(exercise_question.exams);

  const { learning_packet, sub_learning_packet, learning_category } =
    useDefaultClassificationRouteParams();

  useEffect(() => {
    const fetchData = async () => {
      fetch(route('api.leaderboard-exam', exercise_question.id), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(data => {
          setData(data.exams);
        })
        .catch(err => console.warn(err));
    };

    const fetchDataIntervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(fetchDataIntervalId);
  }, []);

  const sortedExam = React.useMemo(() => {
    return Object.values(groupBy(data, it => it.user_id))
      .map(it => maxBy(it, it => it.answers_sum_score)!)
      .sort((a, b) => b.answers_sum_score - a.answers_sum_score);
    // return exercise_question.exams.slice().sort((a,b) => a.:A)
  }, [JSON.stringify(data)]);

  const dataColumns = [
    { header: 'User', accessorKey: 'user.name' },
    {
      header: 'Waktu Mulai',
      accessorFn: it => new Date(it.created_at).toLocaleString(),
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: it => {
        console.log(it.finished_at);
        if (it.finished_at === null) {
          return 'Belum Selesai';
        }
        return new Date(it.finished_at).toLocaleString();
      },
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

  return (
    <AdminTableLayout title="Leaderboard">
      <div className="flex justify-end">
        <MuiInertiaLinkButton
          href={route('packet.sub.category.exercise.show', [
            learning_packet,
            sub_learning_packet,
            learning_category,
            exercise_question.id,
          ])}
        >
          Kembali
        </MuiInertiaLinkButton>
      </div>
      <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <LazyLoadMRT
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
          muiTableHeadCellProps={{
            sx: {
              fontWeight: 'bold',
              fontSize: '16px',
            },
          }}
          renderRowActions={({ row }) => (
            <div className="flex items-center justify-center gap-2">
              <MuiInertiaLinkButton
                href={route('packet.sub.category.exercise.leaderboard.result',
                  [
                    learning_packet,
                    sub_learning_packet,
                    learning_category,
                    exercise_question.id,
                    row.original.id
                  ])}
              >
                Show
              </MuiInertiaLinkButton>
            </div>
          )}
        />
      </div>
    </AdminTableLayout>
  );
}
