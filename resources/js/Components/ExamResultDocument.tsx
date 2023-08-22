import { ExamModel } from '@/Models/Exam';
import { User } from '@/types';
import React from 'react';

interface Props {
  exam: ExamModel;
  user: User;
}

interface ExamResult {
  aspect: string;
  question_count: number;
  answered_count: number;
  time: string;
  correct_count: number;
  incorrect_count: number;
  score: number;
}

const resultData: ExamResult[] = [
  {
    aspect: 'Hitung Biasa',
    question_count: 12,
    answered_count: 12,
    time: '00:05:14',
    correct_count: 11,
    incorrect_count: 1,
    score: 11,
  }, {
    aspect: 'Gambar',
    question_count: 11,
    answered_count: 11,
    time: '00:02:50',
    correct_count: 10,
    incorrect_count: 1,
    score: 10,
  }, {
    aspect: 'Cerita Bahasa',
    question_count: 12,
    answered_count: 12,
    time: '00:11:33',
    correct_count: 9,
    incorrect_count: 3,
    score: 9,
  }, {
    aspect: 'Soal Cerita',
    question_count: 11,
    answered_count: 11,
    time: '00:16:04',
    correct_count: 10,
    incorrect_count: 1,
    score: 10,
  }, {
    aspect: 'Cerita Matematika',
    question_count: 6,
    answered_count: 6,
    time: '00:05:50',
    correct_count: 5,
    incorrect_count: 1,
    score: 5,
  }, {
    aspect: 'Menyimpulkan',
    question_count: 18,
    answered_count: 18,
    time: '00:10:43',
    correct_count: 14,
    incorrect_count: 4,
    score: 14,
  }, {
    aspect: 'Hitungan Pola',
    question_count: 10,
    answered_count: 10,
    time: '00:07:05',
    correct_count: 9,
    incorrect_count: 1,
    score: 9,
  }, {
    aspect: 'Vocabulary',
    question_count: 15,
    answered_count: 15,
    time: '00:02:45',
    correct_count: 8,
    incorrect_count: 7,
    score: 8,
  }, {
    aspect: 'Deret',
    question_count: 5,
    answered_count: 5,
    time: '00:01:15',
    correct_count: 5,
    incorrect_count: 0,
    score: 5,
  }
];


export default function ExamResultDocument({ exam, user }: Props) {

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

  return (
    <div>
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
          </tr>
          {/* TODO: Change with Exact Value */}
          {resultData.map((item, index) => (
            <tr className="text-lg font-semibold" key={index}>
              <td className="border border-black">{item.aspect}</td>
              <td className="border border-black">{item.question_count}</td>
              <td className="border border-black">{item.answered_count}</td>
              <td className="border border-black">{item.time}</td>
              <td className="border border-black">{item.correct_count}</td>
              <td className="border border-black">{item.incorrect_count}</td>
              <td className="border border-black">{item.score}</td>
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
          </tr>

        </table>
      </div>
      <div className="flex justify-end text-lg font-bold">
        <div className="w-1/4">
          <p className="mb-10">Pemeriksa</p>
          <p className="mt-10 underline-offset-2 underline">Admin CAT</p>
        </div>
      </div>
    </div >
  );
}
