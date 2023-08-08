import React from 'react';
import AppLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, Title, Legend, Tooltip, ArcElement } from 'chart.js';
import mulberry32 from '@/Utils/Mulberry32.';
import { User } from '@/types';

interface LearningPacketWithDetailCount extends LearningPacketModel {
  bank_question_items_count: number;
  users_count: number;
}

interface Props {
  user : User
  users_count: number;
  students_count: number;
  sum_of_bank_question_items: number;
  learning_packets: LearningPacketWithDetailCount[];
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Legend,
  Tooltip
);

export default function Dashboard(props: Props) {

  const learningPacketQuestionItems = props.learning_packets.map((learning_packet) => {
    return {
      label: learning_packet.name,
      data: learning_packet.bank_question_items_count,
    };
  });

  const learningPacketUsers = props.learning_packets.map((learning_packet) => {
    return {
      label: learning_packet.name,
      data: learning_packet.users_count,
    };
  });

  const generateRandomColor = (length: number) => {
    const result = [];
    const learningPacketId = props.learning_packets.map((learning_packet) => learning_packet.id).splice(0, 2);
    for (let i = 0; i < length; i++) {
      result.push(`rgb(${Math.floor(mulberry32(learningPacketId[i] * 10) * 255)}, ${Math.floor(mulberry32(learningPacketId[i] * 1) * 255)}, ${Math.floor(mulberry32(learningPacketId[i] * 100) * 255)})`);
    }
    return result;
  };

  const baseBackgroundColor = [
    'rgb(58, 99, 245)',
    'rgb(15, 191, 0)',
    ...generateRandomColor(learningPacketQuestionItems.length - 1),
  ];

  const baseBorderColor = [
    'rgb(58, 99, 245)',
    'rgb(15, 191, 0)',
    ...generateRandomColor(learningPacketQuestionItems.length - 1),
  ];

  function rgbToHex(rgbString: string) {
    const regex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/;

    const match = rgbString.match(regex);

    if (match) {
      const [, r, g, b] = match.map(Number);
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
  }

  return (
    <AppLayout title="Dashboard">
      <div className="mx-auto sm:px-6 lg:px-8">
        <div className="my-4 flex flex-col gap-5 text-[#3A63F5]  font-bold">
          <div className="text-3xl lg:text-6xl">
            Selamat Datang, {props.user.name}
          </div>
          <div className='grid grid-cols-2 gap-5'>
            <div className='flex flex-col w-full gap-5'>
              <div className="flex justify-between gap-3 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 py-auto h-full">
                <p className='my-auto'>
                  <span className="text-xl text-black ">Semua Akun</span>
                </p>
                <p className='m-auto '>
                  <span className="text-5xl">{props.users_count}</span>
                </p>
              </div>
              <div className="flex justify-between gap-3 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 h-full">
                <p className='my-auto'>
                  <span className="text-xl text-black ">Akun Student</span>
                </p>
                <p className='m-auto'>
                  <span className="text-5xl">{props.students_count}</span>
                </p>
              </div>
            </div>
            <div className='w-full flex justify-evenly gap-3 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 h-full'>
              <div className='flex flex-col my-auto'>
                <p className='text-xl'>
                  Bank Soal
                </p>
                <p className='text-5xl mx-auto'>
                  {props.sum_of_bank_question_items}
                </p>
              </div>
              <div>
                <Pie
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Jumlah Soal per Paket Belajar'
                      }
                    }
                  }}
                  data={{
                    labels: learningPacketQuestionItems.map((learningPacket) => learningPacket.label),
                    datasets: [{
                      label: 'Jumlah Soal',
                      data: learningPacketQuestionItems.map((learningPacket) => learningPacket.data),
                      backgroundColor: baseBackgroundColor,
                      borderColor: baseBorderColor
                    }]
                  }}
                />
              </div>
            </div>
            <div className='w-full flex justify-evenly gap-3 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50'>
              <div>
                <Pie
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Jumlah Peserta Paket Belajar'
                      }
                    }
                  }}
                  data={{
                    labels: learningPacketUsers.map((learningPacket) => learningPacket.label),
                    datasets: [{
                      label: 'Jumlah Peserta',
                      data: learningPacketUsers.map((learningPacket) => learningPacket.data),
                      backgroundColor: baseBackgroundColor,
                      borderColor: baseBorderColor
                    }]
                  }}
                />
              </div>
            </div>
            <div className='flex flex-col gap-5 w-full h-full'>
              {
                props.learning_packets.map((learning_packet, index) => {
                  const backgroundColor = rgbToHex(baseBackgroundColor[index]);
                  return (
                    <div className={`flex justify-between my-auto gap-3 p-7 text-white shadow-2xl sm:rounded-3xl bg-[${backgroundColor?.toUpperCase()}] shadow-sky-400/50 h-full`} key={index}>
                      <p className='text-3xl my-auto'>
                        {learning_packet.name}
                      </p>
                      <p className='text-5xl my-auto'>
                        {learning_packet.users_count}
                      </p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
