import React, { PropsWithChildren } from 'react';

import Banner from '@/Components/Jetstream/Banner';
import ResponsiveNavLink from '@/Components/Jetstream/ResponsiveNavLink';
import useRoute from '@/Hooks/useRoute';
import useTypedPage from '@/Hooks/useTypedPage';
import { Inertia } from '@inertiajs/inertia';
import { Box } from '@mui/material';
import { Head } from '@inertiajs/inertia-react';

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
    <div className="h-screen bg-gradient-to-b from-white to-blue-100">
      <Head title={title || 'ABC'} />
      <Banner />
      <nav className="flex justify-between w-full sticky bg-sky-300 py-10 px-10">
        <div className="flex gap-3 max-w-6xl mx-10">
          <span className="text-3xl font-bold">{title || 'ABC'}</span>
        </div>
      </nav>
      {children}
    </div>
  );
}
