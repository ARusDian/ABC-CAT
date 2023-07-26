import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { Assignment } from '@mui/icons-material';
import React from 'react';

export default function Home() {
  return (
    <DashboardLayout title="Home">
      <div className="flex flex-col gap-5">
        <div className="text-5xl text-[#3A63F5]">LAYANAN BELAJAR</div>
        <div className="flex gap-5 justify-around py-5 ">
          <div className="p-5 rounded-lg border basis-1/2 bg-[#3A63F5] text-white hover:bg-blue-700 overflow-hidden shadow-2xl sm:rounded-3xl ">
            <div className="flex flex-col gap-5 mx-auto p-4">
              <div className="mx-auto">
                <Assignment fontSize="large" />
              </div>
              <div className="text-3xl text-center font-semibold">
                SEKOLAH KEDINASAN
              </div>
              <p>
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum
              </p>
            </div>
          </div>
          <div className="p-5 rounded-lg border basis-1/2 text-[#3A63F5] hover:bg-blue-100 overflow-hidden shadow-2xl sm:rounded-3xl ">
            <div className="flex flex-col gap-5 mx-auto p-4">
              <div className="mx-auto">
                <Assignment fontSize="large" />
              </div>
              <div className="text-3xl  text-center font-semibold">
                KEPOLISIAN
              </div>
              <p>
                Lorem Ipsum passages, and more recently with desktop publishing
                software like Aldus PageMaker including versions of Lorem Ipsum
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
