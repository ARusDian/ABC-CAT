import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { asset } from '@/Models/Helper';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketModel } from '@/Models/UserLearningPacket';
import { Link } from '@inertiajs/react';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  user_learning_packets: UserLearningPacketModel[];
  learning_packets: LearningPacketModel[];
}

export default function Dashboard({
  user_learning_packets,
  learning_packets,
}: Props) {
  return (
    <DashboardLayout title="Home">
      <div className="flex flex-col gap-5">
        <div className="text-5xl text-[#3A63F5]">LAYANAN BELAJAR</div>
        <div className="grid grid-cols-2 gap-5 justify-around py-5 ">
          {learning_packets.map(learningPacket => {
            const isSubscribed = user_learning_packets.some(
              userLearningPacket =>
                userLearningPacket.learning_packet_id === learningPacket.id,
            );
            return (
              <Link
                type="button"
                className={`p-5 rounded-lg border overflow-hidden shadow-2xl sm:rounded-3xl 
                ${
                  isSubscribed
                    ? 'bg-white hover:bg-[#3A63F5] text-[#3A63F5] hover:text-white'
                    : 'bg-[#fff2f2] text-gray-500'
                }`}
                key={learningPacket.id}
                href={
                  isSubscribed
                    ? route('student.packet.show', learningPacket.id)
                    : route('dashboard')
                }
              >
                <div className="flex flex-col gap-5 mx-auto p-4">
                  <div className="mx-auto">
                    <img
                      className={`w-40 h-40 ${isSubscribed ? '' : 'grayscale'}`} 
                      src={learningPacket.photo_path
                        ? asset('public', learningPacket.photo_path)
                        : asset('root', 'assets/image/default-image.jpg')}
                      alt={learningPacket.name}
                    />
                  </div>
                  <div className="text-3xl  text-center font-semibold">
                    {learningPacket.name}
                  </div>
                  <p>{learningPacket.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
