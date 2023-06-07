import { InertiaLink } from '@inertiajs/inertia-react';
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
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6 sm:px-20 bg-white border-b border-gray-200">
              {customHeader ? (
                customHeader
              ) : (
                <div className="flex justify-between">
                  <div className="mt-8 text-2xl">{title}</div>
                  <div className="">
                    {addRoute ? (
                      <InertiaLink
                        href={addRoute}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size='large'
                        >
                          {addRouteTitle ?? `Tambah ${title}`}
                        </Button>
                      </InertiaLink>
                    ) : null}
                  </div>
                </div>
              )}
              <div className="mt-6 text-gray-500">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
