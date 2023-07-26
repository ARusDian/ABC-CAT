import { Link } from '@inertiajs/react';
import React from 'react';
import route from 'ziggy-js';
import DashboardAdminLayout from './DashboardAdminLayout';
import { Button } from '@mui/material';

export interface Props {
  title: string;

  addRoute?: string;
  addRouteTitle?: string;
  customHeader?: React.ReactNode;
}

export default function AdminTableLayout({
  title,
  addRoute,
  addRouteTitle,
  customHeader,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <DashboardAdminLayout title={title}>
      <div className="p-6 sm:px-20 bg-white">
        {customHeader ? (
          customHeader
        ) : (
          <div className="flex justify-between">
            <div className="mt-8 text-2xl">{title}</div>
            <div className="">
              {addRoute ? (
                <Link href={addRoute}>
                  <Button variant="contained" color="primary" size="large">
                    {addRouteTitle ?? `Tambah ${title}`}
                  </Button>
                </Link>
              ) : null}
            </div>
          </div>
        )}
        <div className="mt-6 text-gray-500">{children}</div>
      </div>
    </DashboardAdminLayout>
  );
}
