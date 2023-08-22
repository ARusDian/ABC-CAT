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

export default function KecermatanResultDocument({ exam, user }: Props) {
  const labels = [
    'Kolom 1',
    'Kolom 2',
    'Kolom 3',
    'Kolom 4',
    'Kolom 5',
    'Kolom 6',
    'Kolom 7',
    'Kolom 8',
    'Kolom 9',
    'Kolom 10',
  ];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Benar',
        data: [45, 49, 41, 48, 40, 49, 48, 35, 50, 50],
        fill: false,
        borderColor: 'rgb(0, 192, 0)',
        tension: 0.1,
      },
      {
        label: 'Salah',
        data: [5, 1, 9, 2, 10, 1, 2, 15, 0, 0],
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
        <div>
          <table>
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
        </div>
        <div>
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
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 1</td>
            <td className="border border-black">50</td>
            <td className="border border-black">45</td>
            <td className="border border-black">00:01:18</td>
            <td className="border border-black">45</td>
            <td className="border border-black">5</td>
            <td className="border border-black">45</td>
            <td className="border border-black">Sangat Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 2</td>
            <td className="border border-black">50</td>
            <td className="border border-black">49</td>
            <td className="border border-black">00:01:56</td>
            <td className="border border-black">49</td>
            <td className="border border-black">1</td>
            <td className="border border-black">49</td>
            <td className="border border-black">Sangat Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 3</td>
            <td className="border border-black">50</td>
            <td className="border border-black">41</td>
            <td className="border border-black">00:01:39</td>
            <td className="border border-black">41</td>
            <td className="border border-black">9</td>
            <td className="border border-black">41</td>
            <td className="border border-black">Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 4</td>
            <td className="border border-black">50</td>
            <td className="border border-black">48</td>
            <td className="border border-black">00:01:52</td>
            <td className="border border-black">48</td>
            <td className="border border-black">2</td>
            <td className="border border-black">48</td>
            <td className="border border-black">Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 5</td>
            <td className="border border-black">50</td>
            <td className="border border-black">40</td>
            <td className="border border-black">00:01:18</td>
            <td className="border border-black">40</td>
            <td className="border border-black">10</td>
            <td className="border border-black">40</td>
            <td className="border border-black">Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 6</td>
            <td className="border border-black">50</td>
            <td className="border border-black">49</td>
            <td className="border border-black">00:01:34</td>
            <td className="border border-black">49</td>
            <td className="border border-black">1</td>
            <td className="border border-black">49</td>
            <td className="border border-black">Sangat Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 7</td>
            <td className="border border-black">50</td>
            <td className="border border-black">48</td>
            <td className="border border-black">00:01:56</td>
            <td className="border border-black">48</td>
            <td className="border border-black">2</td>
            <td className="border border-black">48</td>
            <td className="border border-black">Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 8</td>
            <td className="border border-black">50</td>
            <td className="border border-black">35</td>
            <td className="border border-black">00:01:21</td>
            <td className="border border-black">35</td>
            <td className="border border-black">15</td>
            <td className="border border-black">35</td>
            <td className="border border-black">Cukup</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 9</td>
            <td className="border border-black">50</td>
            <td className="border border-black">50</td>
            <td className="border border-black">00:01:45</td>
            <td className="border border-black">50</td>
            <td className="border border-black">0</td>
            <td className="border border-black">50</td>
            <td className="border border-black">Sangat Baik</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black pl-1">Kolom 10</td>
            <td className="border border-black">50</td>
            <td className="border border-black">50</td>
            <td className="border border-black">00:01:33</td>
            <td className="border border-black">50</td>
            <td className="border border-black">0</td>
            <td className="border border-black">50</td>
            <td className="border border-black">Sangat Baik</td>
          </tr>
          <tr className="items-center text-lg font-bold">
            <td className="border border-black">Total</td>
            <td className="border border-black">500</td>
            <td className="border border-black">459</td>
            <td className="border border-black">00:16:12</td>
            <td className="border border-black">455</td>
            <td className="border border-black">45</td>
            <td className="border border-black">455</td>
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
