import { Link } from '@inertiajs/react'
import React from 'react';
import route from 'ziggy-js';
import DashboardAdminLayout from './DashboardAdminLayout';
import { Button } from '@mui/material';
import styled from '@mui/material/styles/styled';

export interface Props {
  title: string;

  addRoute?: string;
  addRouteTitle?: string;
  customHeader?: React.ReactNode;
}

const StyledButton = styled(Button)({
  background: '#00b51d',
});

export default function AdminTableLayout({
  title,
  addRoute,
  addRouteTitle,
  customHeader,
  children,
}: React.PropsWithChildren<Props>) {
  return (
    <DashboardAdminLayout title={title}>
      <div className="p-6 ">
        {customHeader ? (
          customHeader
        ) : (
          <div className="flex justify-between">
            <div className="mt-8 text-2xl">{title}</div>
            <div className="">
              {addRoute ? (
                <Link href={addRoute}>
                  <StyledButton variant="contained" size="large">
                    {addRouteTitle ?? `Tambah ${title}`}
                  </StyledButton>
                </Link>
              ) : null}
            </div>
          </div>
        )}
        <div className="mt-6 p-7 text-gray-500 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
          {children}
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
