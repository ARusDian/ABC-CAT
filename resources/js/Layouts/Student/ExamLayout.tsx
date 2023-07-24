import React, { PropsWithChildren } from 'react';

import Banner from '@/Components/Jetstream/Banner';
import ResponsiveNavLink from '@/Components/Jetstream/ResponsiveNavLink';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Inertia } from '@inertiajs/inertia';
import { Box } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';
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
    <div className="min-h-screen h-full bg-gradient-to-b from-blue-50 to-blue-100">
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
    </div>
  );
}
