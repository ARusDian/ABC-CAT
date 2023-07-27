import { Link } from '@inertiajs/react';
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
      <div className="flex justify-between mx-12">
        <div className="text-2xl">{title}</div>
        {backRoute ? (
          <Button variant="contained" color="primary" size="large">
            <Link href={backRoute}>{backRouteTitle ?? 'Kembali'}</Link>
          </Button>
        ) : null}
      </div>
      <div className=" m-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        {props.children}
      </div>
    </DashboardAdminLayout>
  );
}
