import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Link } from '@inertiajs/react';
import { Button } from '@mui/material';
import React from 'react';
import { useConfirm } from 'material-ui-confirm';

interface Props {
  title: string;
  headerTitle: string;

  backRoute?: string;
  backRouteTitle?: string;

  editRoute?: string;
  editRouteTitle?: string;

  onDelete?: () => any;
  deleteTitle?: string;
  onDeleteMessage?: string;
  isRestore?: boolean;
}

export default function Index(props: React.PropsWithChildren<Props>) {
  const confirm = useConfirm();
  const {
    title,
    headerTitle,
    backRoute,
    backRouteTitle,
    editRoute,
    editRouteTitle,
    onDelete,
    deleteTitle,
    onDeleteMessage,
    isRestore,
  } = props;

  const handleDelete = () => {
    confirm({
      description:
        onDeleteMessage || `Ini akan menghapus ${headerTitle} selamanya.`,
      confirmationButtonProps: { autoFocus: true },
    })
      .then(onDelete)
      .catch(() => console.log('Deletion cancelled.'));
  };

  return (
    <DashboardAdminLayout title={title}>
      <div className="p-6 sm:px-20 bg-white border-b border-gray-200 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="mt-8 text-2xl">{headerTitle}</div>
          <div className="flex flex-col md:flex-row gap-3">
            {backRoute ? (
              <Link href={backRoute} className="my-auto">
                <Button variant="contained" color="primary" size="large">
                  {backRouteTitle ?? 'Kembali'}
                </Button>
              </Link>
            ) : null}

            {editRoute ? (
              <Link href={editRoute} className="my-auto">
                <Button variant="contained" color="warning" size="large">
                  {editRouteTitle ?? 'Edit'}
                </Button>
              </Link>
            ) : null}

            {onDelete ? (
              <div className="flex flex-col justify-center">
                <Button
                  variant="contained"
                  color={isRestore ? 'success' : 'error'}
                  onClick={handleDelete}
                  size="large"
                >
                  <label htmlFor="my-modal">{deleteTitle ?? 'Hapus'}</label>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        {props.children}
      </div>
    </DashboardAdminLayout>
  );
}
