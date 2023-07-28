import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketModel } from '@/Models/UserLearningPacket';
import { Link, router } from '@inertiajs/react';
import { Assignment } from '@mui/icons-material';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  userLearningPackets: UserLearningPacketModel[];
  learningPackets: LearningPacketModel[];
}

export default function Dashboard({ userLearningPackets, learningPackets }: Props) {
  return (
    <DashboardLayout title="Home">
      <div className="flex flex-col gap-5">
        <div className="text-5xl text-[#3A63F5]">LAYANAN BELAJAR</div>
        <div className="grid grid-cols-2 gap-5 justify-around py-5 ">
          {learningPackets.map((learningPacket) => {
            const isSubscribed = userLearningPackets.some(
              (userLearningPacket) => userLearningPacket.learning_packet_id === learningPacket.id
            );
            return (
              <Link
                type='button'
                className={
                  `p-5 rounded-lg border overflow-hidden shadow-2xl sm:rounded-3xl 
                ${isSubscribed ?
                    'bg-white hover:bg-[#3A63F5] text-[#3A63F5] hover:text-white' : 'bg-[#fff2f2] text-gray-500'}`
                }
                key={learningPacket.id}
                href={isSubscribed ? route('student.learning-packet.show', learningPacket.id) : route('dashboard')}
              >
                <div className="flex flex-col gap-5 mx-auto p-4">
                  <div className="mx-auto">
                    <Assignment fontSize="large" />
                  </div>
                  <div className="text-3xl  text-center font-semibold">
                    {learningPacket.name}
                  </div>
                  <p>
                    {learningPacket.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
