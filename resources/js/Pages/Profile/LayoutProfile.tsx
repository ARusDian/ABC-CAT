import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { User } from '@/types';
import React from 'react';

interface Props {
  user: User;
  title: string;
  children: React.ReactNode;
}

export default function LayoutProfile({ user, title, children }: Props) {
  const isAdmin = user.roles.find(
    role => role.name === 'admin' || role.name === 'super-admin',
  );
  return isAdmin ? (
    <DashboardAdminLayout title={title}>{children}</DashboardAdminLayout>
  ) : (
    <DashboardLayout title={title}>{children}</DashboardLayout>
  );
}
