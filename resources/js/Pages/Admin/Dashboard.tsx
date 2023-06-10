import React from 'react';

import AppLayout from '@/Layouts/Admin/DashboardAdminLayout';

interface Props {}

export default function Dashboard(props: Props) {
  return (
    <AppLayout title="Dashboard">
      <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
        <div className="my-4 flex flex-col gap-5">
          <div className="text-3xl lg:text-6xl font-bold">
            Selamat Datang di ABC-CAT
          </div>
          <div className="lg:text-xl"></div>
        </div>
      </div>
    </AppLayout>
  );
}
