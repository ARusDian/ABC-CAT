import React from 'react';

import AppLayout from '@/Layouts/DashboardAdminLayout';

interface Props {
}

export default function Dashboard(props: Props) {
  return (
    <AppLayout
      title="Dashboard"
    >
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-4">
          <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
            <div className='my-4 flex flex-col gap-5'>
              <div className='text-3xl lg:text-6xl font-bold'>
                Selamat Datang di ABC-CAT
              </div>
              <div className='lg:text-xl'>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
