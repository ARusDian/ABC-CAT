import { Link } from '@inertiajs/react'
import React from 'react';
import DashboardAdminLayout from './DashboardAdminLayout';
import { Button } from '@mui/material';

export interface Props {
  title: string;

  backRoute?: string;
  backRouteTitle?: string;
}

export default function AdminFormLayout(props: React.PropsWithChildren<Props>) {
  const { backRoute, backRouteTitle, title } = props;
  return (
    <DashboardAdminLayout title={title}>
      <div className="flex justify-between">
        <div className="text-2xl">{title}</div>
        {backRoute ? (
          <Button variant="contained" color="primary" size="large">
            <Link href={backRoute}>
              {backRouteTitle ?? 'Kembali'}
            </Link>
          </Button>
        ) : null}
      </div>
      {props.children}
    </DashboardAdminLayout>
  );
}
