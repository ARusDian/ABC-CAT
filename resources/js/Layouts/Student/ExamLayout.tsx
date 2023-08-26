import React, { PropsWithChildren } from 'react';

import Banner from '@/Components/Jetstream/Banner';
import { Head } from '@inertiajs/react';
import { asset } from '@/Models/Helper';

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
  isAdministrator?: boolean;
}

export default function DashboardAdminLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="min-h-screen h-full min-w-full w-full bg-gradient-to-b from-blue-50 to-blue-100">
      <Head title={title || 'ABC'} />
      <Banner />
      <nav className="flex justify-center w-full sticky bg-sky-300 py-5 px-10">
        <div className="flex gap-3 max-w-6xl mx-10">
          <img
            src={asset('root', 'assets/image/logo.png')}
            alt="logo"
            className="h-20"
          />
        </div>
      </nav>
      {children}
      <div className='w-full bg-blue-50 fixed bottom-0 text-center shadow shadow-sky-400/50 py-1'>
        ABC-CAT @2023 Ver. 1.1.0
      </div>
    </div>
  );
}
