import {
  ExamModel,
  ExamResult,
  examToResult,
  resultToTotal,
} from '@/Models/Exam';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { User } from '@/types';
import { result } from 'lodash';
import _ from 'lodash';
import { getUniqueKey } from '@/Models/Helper';

interface Props {
  exam: ExamModel;
  user: User;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

// const resultData: ExamResult[] = [
//   {
//     aspect: 'Kolom 1',
//     count: 50,
//     answered: 45,
//     time_formatted: '00:01:18',
//     correct: 45,
//     incorrect: 5,
//     score: 45,
//   }, {
//     aspect: 'Kolom 2',
//     count: 50,
//     answered: 49,
//     time_formatted: '00:01:56',
//     correct: 49,
//     incorrect: 1,
//     score: 49,
//   }, {
//     aspect: 'Kolom 3',
//     count: 50,
//     answered: 41,
//     time_formatted: '00:01:39',
//     correct: 41,
//     incorrect: 9,
//     score: 41,
//   }, {
//     aspect: 'Kolom 4',
//     count: 50,
//     answered: 48,
//     time_formatted: '00:01:52',
//     correct: 48,
//     incorrect: 2,
//     score: 48,
//   }, {
//     aspect: 'Kolom 5',
//     count: 50,
//     answered: 40,
//     time_formatted: '00:01:18',
//     correct: 40,
//     incorrect: 10,
//     score: 40,
//   }, {
//     aspect: 'Kolom 6',
//     count: 50,
//     answered: 49,
//     time_formatted: '00:01:34',
//     correct: 49,
//     incorrect: 1,
//     score: 49,
//   }, {
//     aspect: 'Kolom 7',
//     count: 50,
//     answered: 48,
//     time_formatted: '00:01:56',
//     correct: 48,
//     incorrect: 2,
//     score: 48,
//   }, {
//     aspect: 'Kolom 8',
//     count: 50,
//     answered: 35,
//     time_formatted: '00:01:21',
//     correct: 35,
//     incorrect: 15,
//     score: 35,
//   }, {
//     aspect: 'Kolom 9',
//     count: 50,
//     answered: 50,
//     time_formatted: '00:01:45',
//     correct: 50,
//     incorrect: 0,
//     score: 50,
//   }, {
//     aspect: 'Kolom 10',
//     count: 50,
//     answered: 50,
//     time_formatted: '00:01:33',
//     correct: 50,
//     incorrect: 0,
//     score: 50,
//   },
// ]

export default function KecermatanResultDocument({ exam, user }: Props) {
  const resultData = React.useMemo(() => {
    return examToResult(exam);
  }, [exam]);

  const totalResult = React.useMemo(
    () => resultToTotal(resultData),
    [resultData],
  );

  const data = {
    labels: resultData.map(item => item.aspect),
    datasets: [
      {
        label: 'Benar',
        data: resultData.map(item => item.correct),
        fill: false,
        borderColor: 'rgb(0, 192, 0)',
        tension: 0.1,
      },
      {
        label: 'Salah',
        data: resultData.map(item => item.incorrect),
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  };

  const getScoreCategory = (score: number) => {
    const scores: Record<string, number> = {
      'Sangat Baik': 26,
      Baik: 23,
      Cukup: 20,
      Kurang: 10,
      'Sangat Kurang': 0,
    };

    for (var [name, minimum] of Object.entries(scores)) {
      if (score >= minimum) {
        return name;
      }
    }
  };

  return (
    <div className="w-full">
      <div className="border-b-4 border-y-black border-double border-t ">
        <div
          className="flex justify-center text-white"
          style={{
            backgroundColor: '#4383e8',
          }}
        >
          <p className="text-2xl font-bold p-3 uppercase ">HASIL TES</p>
        </div>
      </div>
      <div className="grid grid-cols-2 px-1">
        <table className="w-full">
          <tr>
            <td>Judul</td>
            <td>:</td>
            <td>{exam.exercise_question.name}</td>
          </tr>
          <tr>
            <td>Paket</td>
            <td>:</td>
            <td>{exam.exercise_question.learning_category?.name}</td>
          </tr>
          <tr>
            <td>Jadwal</td>
            <td>:</td>
            <td>
              {`${new Date(exam.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
              })}, ${new Date(exam.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
              })} ${new Date(exam.created_at).toLocaleDateString('id-ID', {
                month: 'long',
              })} ${new Date(exam.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
              })}`}
            </td>
          </tr>
          <tr>
            <td>Waktu </td>
            <td>:</td>
            <td>{exam.exercise_question.time_limit} Menit</td>
          </tr>
        </table>
        <table>
          <tr>
            <td>Peserta</td>
            <td>:</td>
            <td>{user.name}</td>
          </tr>
          <tr>
            <td>No Tes</td>
            <td>:</td>
            <td>{exam.id.toString().padStart(3, '0')}</td>
          </tr>
          <tr>
            <td>Mulai / Selesai</td>
            <td>:</td>
            <td>
              {`${new Date(exam.created_at).toLocaleTimeString('id-ID', {
                hour: 'numeric',
                minute: 'numeric',
              })} / ${new Date(exam.updated_at).toLocaleTimeString('id-ID', {
                hour: 'numeric',
                minute: 'numeric',
              })}`}
            </td>
          </tr>
          <tr>
            <td>Status</td>
            <td>:</td>
            <td>{exam.finished_at ? 'Tes Selesai' : 'Tes Belum Selesai'}</td>
          </tr>
        </table>
      </div>
      <div className="border-y-black border-y ">
        <div
          className="text-white"
          style={{
            backgroundColor: '#4383e8',
          }}
        >
          <p className="text-lg font-bold p-1 uppercase ">
            {exam.exercise_question.learning_category?.name}
          </p>
        </div>
      </div>
      <div className="p-1">
        <table className="w-full text-center">
          <tr className="items-center text-lg font-semibold">
            <th className="border border-black">Aspek</th>
            <th className="border border-black">Soal</th>
            <th className="border border-black">Jawab</th>
            <th className="border border-black">Waktu</th>
            <th className="border border-black">Benar</th>
            <th className="border border-black">Salah</th>
            <th className="border border-black">Skor</th>
            <th className="border border-black">Kategori</th>
          </tr>
          {/* TODO: Change with Exact Value */}
          {resultData.map(item => (
            <tr className="text-lg font-semibold" key={getUniqueKey(item)}>
              <td className="border border-black">{item.aspect}</td>
              <td className="border border-black">{item.count}</td>
              <td className="border border-black">{item.answered}</td>
              <td className="border border-black">{item.time_formatted}</td>
              <td className="border border-black">{item.correct}</td>
              <td className="border border-black">{item.incorrect}</td>
              <td className="border border-black">{item.score}</td>
              <td className="border border-black">
                {getScoreCategory(item.score)}
              </td>
            </tr>
          ))}
          <tr className="text-lg font-semibold">
            <td className="border border-black">Total</td>
            <td className="border border-black">{totalResult.count}</td>
            <td className="border border-black">{totalResult.answered}</td>
            <td className="border border-black">
              {totalResult.time_formatted}
            </td>
            <td className="border border-black">{totalResult.correct}</td>
            <td className="border border-black">{totalResult.incorrect}</td>
            <td className="border border-black">{totalResult.score}</td>
            <td className="border border-black"></td>
          </tr>
        </table>
      </div>
      <div className="w-full mx-auto">
        <Line options={options} data={data} />
      </div>
      <div className="flex justify-end text-lg font-bold">
        <div className="w-1/4">
          <p className="mb-10">Pemeriksa</p>
          <p className="mt-10 underline-offset-2 underline">Admin CAT</p>
        </div>
      </div>
    </div>
  );
}
