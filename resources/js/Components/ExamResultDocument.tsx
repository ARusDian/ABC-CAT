import { ExamModel } from '@/Models/Exam';
import { User } from '@/types';
import React from 'react';

interface Props {
  exam: ExamModel;
  user: User;
}

export default function ExamResultDocument({ exam, user }: Props) {
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
          </tr>
          {/* TODO: Change with Exact Value */}
          <tr className="items-center">
            <td className="text-left border border-black">Hitung Biasa</td>
            <td className="border border-black">12</td>
            <td className="border border-black">12</td>
            <td className="border border-black">00:05:14</td>
            <td className="border border-black">11</td>
            <td className="border border-black">1</td>
            <td className="border border-black">11</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Gambar</td>
            <td className="border border-black">11</td>
            <td className="border border-black">11</td>
            <td className="border border-black">00:02:50</td>
            <td className="border border-black">10</td>
            <td className="border border-black">1</td>
            <td className="border border-black">10</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Cerita Bahasa</td>
            <td className="border border-black">12</td>
            <td className="border border-black">12</td>
            <td className="border border-black">00:11:33</td>
            <td className="border border-black">9</td>
            <td className="border border-black">3</td>
            <td className="border border-black">9</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Soal Cerita</td>
            <td className="border border-black">11</td>
            <td className="border border-black">11</td>
            <td className="border border-black">00:16:04</td>
            <td className="border border-black">10</td>
            <td className="border border-black">1</td>
            <td className="border border-black">10</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Cerita Matematika</td>
            <td className="border border-black">6</td>
            <td className="border border-black">6</td>
            <td className="border border-black">00:05:50</td>
            <td className="border border-black">5</td>
            <td className="border border-black">1</td>
            <td className="border border-black">5</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Menyimpulkan</td>
            <td className="border border-black">18</td>
            <td className="border border-black">18</td>
            <td className="border border-black">00:10:43</td>
            <td className="border border-black">14</td>
            <td className="border border-black">4</td>
            <td className="border border-black">14</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Hitungan Pola</td>
            <td className="border border-black">10</td>
            <td className="border border-black">10</td>
            <td className="border border-black">00:07:05</td>
            <td className="border border-black">9</td>
            <td className="border border-black">1</td>
            <td className="border border-black">9</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Vocabulary</td>
            <td className="border border-black">15</td>
            <td className="border border-black">15</td>
            <td className="border border-black">00:02:45</td>
            <td className="border border-black">8</td>
            <td className="border border-black">7</td>
            <td className="border border-black">8</td>
          </tr>
          <tr className="items-center">
            <td className="text-left border border-black">Deret</td>
            <td className="border border-black">5</td>
            <td className="border border-black">5</td>
            <td className="border border-black">00:01:15</td>
            <td className="border border-black">5</td>
            <td className="border border-black">0</td>
            <td className="border border-black">5</td>
          </tr>
          <tr className="items-center text-lg font-bold">
            <td className="border border-black">Total</td>
            <td className="border border-black">100</td>
            <td className="border border-black">100</td>
            <td className="border border-black">01:12:29</td>
            <td className="border border-black">81</td>
            <td className="border border-black">19</td>
            <td className="border border-black">81</td>
          </tr>
        </table>
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
