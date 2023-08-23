import { ExamModel, ExamResult, examToResult, resultToTotal } from '@/Models/Exam';
import { User } from '@/types';
import _ from 'lodash';
import React from 'react';

interface Props {
  exam: ExamModel;
  user: User;
}

// const resultData: ExamResult[] = [
//   {
//     aspect: 'Hitung Biasa',
//     count: 12,
//     answered: 12,
//     time_formatted: '00:05:14',
//     correct: 11,
//     incorrect: 1,
//     score: 11,
//   }, {
//     aspect: 'Gambar',
//     count: 11,
//     answered: 11,
//     time_formatted: '00:02:50',
//     correct: 10,
//     incorrect: 1,
//     score: 10,
//   }, {
//     aspect: 'Cerita Bahasa',
//     count: 12,
//     answered: 12,
//     time_formatted: '00:11:33',
//     correct: 9,
//     incorrect: 3,
//     score: 9,
//   }, {
//     aspect: 'Soal Cerita',
//     count: 11,
//     answered: 11,
//     time_formatted: '00:16:04',
//     correct: 10,
//     incorrect: 1,
//     score: 10,
//   }, {
//     aspect: 'Cerita Matematika',
//     count: 6,
//     answered: 6,
//     time_formatted: '00:05:50',
//     correct: 5,
//     incorrect: 1,
//     score: 5,
//   }, {
//     aspect: 'Menyimpulkan',
//     count: 18,
//     answered: 18,
//     time_formatted: '00:10:43',
//     correct: 14,
//     incorrect: 4,
//     score: 14,
//   }, {
//     aspect: 'Hitungan Pola',
//     count: 10,
//     answered: 10,
//     time_formatted: '00:07:05',
//     correct: 9,
//     incorrect: 1,
//     score: 9,
//   }, {
//     aspect: 'Vocabulary',
//     count: 15,
//     answered: 15,
//     time_formatted: '00:02:45',
//     correct: 8,
//     incorrect: 7,
//     score: 8,
//   }, {
//     aspect: 'Deret',
//     count: 5,
//     answered: 5,
//     time_formatted: '00:01:15',
//     correct: 5,
//     incorrect: 0,
//     score: 5,
//   }
// ];
//

export default function ExamResultDocument({ exam, user }: Props) {
  const resultData = React.useMemo(() => {
    return examToResult(exam);
  }, [exam]);


  const totalResult = React.useMemo(() => {
    return resultToTotal(resultData);
  }, [resultData])

  console.log({ resultData, totalResult })

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
              <td className="border border-black">{item.count}</td>
              <td className="border border-black">{item.answered}</td>
              <td className="border border-black">{item.time_formatted}</td>
              <td className="border border-black">{item.correct}</td>
              <td className="border border-black">{item.incorrect}</td>
              <td className="border border-black">{item.score}</td>
            </tr>
          ))}
          <tr className="text-lg font-semibold">
            <td className="border border-black">Total</td>
            <td className="border border-black">{totalResult.count}</td>
            <td className="border border-black">{totalResult.answered}</td>
            <td className="border border-black">{totalResult.time_formatted}</td>
            <td className="border border-black">{totalResult.correct}</td>
            <td className="border border-black">{totalResult.incorrect}</td>
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
