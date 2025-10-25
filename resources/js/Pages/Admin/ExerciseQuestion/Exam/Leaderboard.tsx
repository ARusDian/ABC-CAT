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
  exercise_question: ExerciseQuestionModel & {};
  exams: ExamModel[];
}

export default function Leaderboard({ exercise_question, exams }: Props) {
  const [data, setData] = useState<ExamModel[]>(exams || []);
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          route('api.leaderboard-exam', exercise_question.id),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          // Ensure we have valid data before setting
          if (result?.exams && Array.isArray(result.exams)) {
            setData(result.exams);
          }
        }
      } catch (err) {
        console.warn('Error fetching leaderboard data:', err);
      }
    };

    // Initial fetch
    fetchData();

    // Set up interval for periodic updates
    const fetchDataIntervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(fetchDataIntervalId);
  }, [exercise_question.id]);

  const sortedExam = React.useMemo(() => {
    // Ensure data is an array
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Group by user_id and filter out invalid entries
    const grouped = groupBy(data, it => it?.user_id);

    return Object.values(grouped)
      .map(userExams => {
        // Filter out any null/undefined entries in the group
        const validExams = userExams.filter(exam => exam != null);

        if (validExams.length === 0) return null;

        // Get the exam with maximum score
        return maxBy(validExams, exam => exam?.answers_sum_score || 0);
      })
      .filter((exam): exam is ExamModel => exam != null) // Type guard to remove nulls
      .sort((a, b) => {
        const scoreA = a?.answers_sum_score || 0;
        const scoreB = b?.answers_sum_score || 0;
        return scoreB - scoreA;
      });
  }, [data]); // Changed dependency to just data

  const dataColumns: MRT_ColumnDef<ExamModel>[] = [
    {
      header: 'User',
      accessorKey: 'user.name',
      Cell: ({ row }) => {
        return row.original?.user?.name || 'Unknown User';
      },
    },
    {
      header: 'Waktu Mulai',
      accessorFn: row => {
        if (!row?.created_at) return 'Tidak tersedia';
        try {
          return new Date(row.created_at).toLocaleString('id-ID');
        } catch {
          return 'Format tanggal tidak valid';
        }
      },
    },
    {
      header: 'Waktu Berakhir',
      accessorFn: row => {
        if (!row?.finished_at || row.finished_at === null) {
          return 'Belum Selesai';
        }
        try {
          return new Date(row.finished_at).toLocaleString('id-ID');
        } catch {
          return 'Format tanggal tidak valid';
        }
      },
    },
    {
      header: 'Score',
      accessorFn: row => {
        const score = row?.answers_sum_score ?? 0;
        return parseFloat(score.toString()).toFixed(2);
      },
      Cell: ({ row }) => {
        const score = row.original?.answers_sum_score ?? 0;
        return <div>{parseFloat(score.toString()).toFixed(2)}</div>;
      },
    },
  ];

  const renderRowActions = ({ row }: { row: any }) => {
    // Check if row and row.original exist and have an id
    if (!row?.original?.id) {
      console.warn('Row missing id:', row);
      return null;
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <MuiInertiaLinkButton
          href={route('packet.sub.category.exercise.exam.result', [
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
    );
  };

  return (
    <AdminTableLayout
      title={`Leaderboard Latihan Soal ${exercise_question?.name || ''}`}
    >
      <div className="flex justify-end my-3">
        <MuiInertiaLinkButton
          href={route('packet.sub.category.exercise.exam', [
            learning_packet_id,
            sub_learning_packet_id,
            learning_category_id,
            exercise_question.id,
          ])}
        >
          Kembali
        </MuiInertiaLinkButton>
      </div>

      <div className="mt-6 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <p>
          <span className="font-bold">
            *Hanya Menampilkan Nilai Tertinggi dari Tiap Siswa
          </span>
        </p>

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
          renderRowActions={renderRowActions}
          // Add state to handle empty data
          state={{
            isLoading: false,
          }}
          // Optional: Add a custom empty message
          localization={{
            noRecordsToDisplay: 'Belum ada data ujian',
          }}
        />
      </div>
    </AdminTableLayout>
  );
}
