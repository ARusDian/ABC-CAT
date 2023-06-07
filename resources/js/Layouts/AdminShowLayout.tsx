import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Button } from '@mui/material';
import React from 'react';

interface Props {
  title: string;
  headerTitle: string;

  backRoute?: string;
  backRouteTitle?: string;

  editRoute?: string;
  editRouteTitle?: string;

  onDelete?: () => any;
  deleteTitle?: string;
}

export default function Index(props: React.PropsWithChildren<Props>) {
  const { title, headerTitle, backRoute, backRouteTitle, editRoute, editRouteTitle, onDelete, deleteTitle } =
    props;
  return (
    <DashboardAdminLayout title={title}>
      <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
          <div className="p-6 sm:px-20 bg-white border-b border-gray-200 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="mt-8 text-2xl">{headerTitle}</div>
              <div className="flex flex-col md:flex-row gap-3">
                {backRoute ? (
                  <InertiaLink
                    href={backRoute}
                    className='my-auto'
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size='large'
                    >
                      {backRouteTitle ?? 'Kembali'}
                    </Button>
                  </InertiaLink>
                ) : null}

                {editRoute ? (
                  <InertiaLink
                    href={editRoute}
                    className='my-auto'
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      size='large'

                    >
                      {editRouteTitle ?? 'Edit'}
                    </Button>
                  </InertiaLink>
                ) : null}

                {onDelete ? (
                  <div className="flex flex-col justify-center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={onDelete}
                      size='large'
                    >
                      <label htmlFor="my-modal">{deleteTitle ?? 'Hapus'}</label>
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
            {props.children}
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
