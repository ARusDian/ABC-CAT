import { ExamModel } from '@/Models/Exam';
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

interface KecermatanResult {
  aspect: string;
  question_count: number;
  answered_count: number;
  time: string;
  correct_count: number;
  incorrect_count: number;
  score: number;

}

const resultData: KecermatanResult[] = [
  {
    aspect: 'Kolom 1',
    question_count: 50,
    answered_count: 45,
    time: '00:01:18',
    correct_count: 45,
    incorrect_count: 5,
    score: 45,
  }, {
    aspect: 'Kolom 2',
    question_count: 50,
    answered_count: 49,
    time: '00:01:56',
    correct_count: 49,
    incorrect_count: 1,
    score: 49,
  }, {
    aspect: 'Kolom 3',
    question_count: 50,
    answered_count: 41,
    time: '00:01:39',
    correct_count: 41,
    incorrect_count: 9,
    score: 41,
  }, {
    aspect: 'Kolom 4',
    question_count: 50,
    answered_count: 48,
    time: '00:01:52',
    correct_count: 48,
    incorrect_count: 2,
    score: 48,
  }, {
    aspect: 'Kolom 5',
    question_count: 50,
    answered_count: 40,
    time: '00:01:18',
    correct_count: 40,
    incorrect_count: 10,
    score: 40,
  }, {
    aspect: 'Kolom 6',
    question_count: 50,
    answered_count: 49,
    time: '00:01:34',
    correct_count: 49,
    incorrect_count: 1,
    score: 49,
  }, {
    aspect: 'Kolom 7',
    question_count: 50,
    answered_count: 48,
    time: '00:01:56',
    correct_count: 48,
    incorrect_count: 2,
    score: 48,
  }, {
    aspect: 'Kolom 8',
    question_count: 50,
    answered_count: 35,
    time: '00:01:21',
    correct_count: 35,
    incorrect_count: 15,
    score: 35,
  }, {
    aspect: 'Kolom 9',
    question_count: 50,
    answered_count: 50,
    time: '00:01:45',
    correct_count: 50,
    incorrect_count: 0,
    score: 50,
  }, {
    aspect: 'Kolom 10',
    question_count: 50,
    answered_count: 50,
    time: '00:01:33',
    correct_count: 50,
    incorrect_count: 0,
    score: 50,
  },
]

export default function KecermatanResultDocument({ exam, user }: Props) {

  const totalResult = {
    aspect: '',
    question_count: 0,
    answered_count: 0,
    time: '00:00:00',
    correct_count: 0,
    incorrect_count: 0,
    score: 0,
  }

  let hour = 0;
  let minute = 0;

  resultData.forEach((item) => {
    totalResult.question_count += item.question_count;
    totalResult.answered_count += item.answered_count;
    totalResult.correct_count += item.correct_count;
    totalResult.incorrect_count += item.incorrect_count;
    totalResult.score += item.score;

    const tempTime = item.time.split(':');
    const tempTotalTime = totalResult.time.split(':');

    hour = parseInt(tempTime[0]) + parseInt(tempTotalTime[0]);
    minute = parseInt(tempTime[1]) + parseInt(tempTotalTime[1]);
    let second = parseInt(tempTime[2]) + parseInt(tempTotalTime[2]);
    if (second >= 60) {
      second -= 60;
      minute += 1;
    }
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
    totalResult.time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  });

  const data = {
    labels: resultData.map((item) => item.aspect),
    datasets: [
      {
        label: 'Benar',
        data: resultData.map((item) => item.correct_count),
        fill: false,
        borderColor: 'rgb(0, 192, 0)',
        tension: 0.1,
      },
      {
        label: 'Salah',
        data: resultData.map((item) => item.incorrect_count),
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
    return score > 25 ? 'Sangat Baik' : score > 22 ? 'Baik' : 'Cukup';
  }

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
        <table className='w-full'>
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
          {resultData.map((item) => (
            <tr className="text-lg font-semibold">
              <td className="border border-black">{item.aspect}</td>
              <td className="border border-black">{item.question_count}</td>
              <td className="border border-black">{item.answered_count}</td>
              <td className="border border-black">{item.time}</td>
              <td className="border border-black">{item.correct_count}</td>
              <td className="border border-black">{item.incorrect_count}</td>
              <td className="border border-black">{item.score}</td>
              <td className="border border-black">{getScoreCategory(item.score)}</td>
            </tr>
          ))}
          <tr className="text-lg font-semibold">
            <td className="border border-black">Total</td>
            <td className="border border-black">{totalResult.question_count}</td>
            <td className="border border-black">{totalResult.answered_count}</td>
            <td className="border border-black">{totalResult.time}</td>
            <td className="border border-black">{totalResult.correct_count}</td>
            <td className="border border-black">{totalResult.incorrect_count}</td>
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
