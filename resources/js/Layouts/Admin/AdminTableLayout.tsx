import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import route from 'ziggy-js';
import DashboardAdminLayout from './DashboardAdminLayout';
import { Button } from '@mui/material';
import styled from '@mui/material/styles/styled';
import { User } from '@/types';

export interface Props {
  title: string;

  addRoute?: string;
  addRouteTitle?: string;
  customHeader?: React.ReactNode;
  isAdminOnlyAction?: boolean;
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
  isAdminOnlyAction,
}: React.PropsWithChildren<Props>) {
  const page = usePage();
  const user = page.props.user as unknown as User;
  const isAdmin = user.roles.some(
    role => role.name === 'super-admin' || role.name === 'admin',
  );
  const allowedAction = isAdmin || !isAdminOnlyAction;
  return (
    <DashboardAdminLayout title={title}>
      <div className="p-6 ">
        {customHeader ? (
          customHeader
        ) : (
          <div className="flex justify-between">
            <div className="mt-8 text-2xl">{title}</div>
            {allowedAction && addRoute && (
              <div className="">
                {addRoute ? (
                  <Link href={addRoute}>
                    <StyledButton variant="contained" size="large">
                      {addRouteTitle ?? `Tambah ${title}`}
                    </StyledButton>
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </DashboardAdminLayout>
  );
}
