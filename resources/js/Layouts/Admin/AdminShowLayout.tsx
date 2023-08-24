import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { Button } from '@mui/material';
import React from 'react';
import { useConfirm } from 'material-ui-confirm';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import { usePage } from '@inertiajs/react';
import { User } from '@/types';

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
  isAdminOnlyAction?: boolean;
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
    isAdminOnlyAction,
  } = props;

  const handleDelete = () => {
    confirm({
      description:
        onDeleteMessage || `Ini akan menghapus ${headerTitle} selamanya.`,
      confirmationButtonProps: { autoFocus: true },
    })
      .then(onDelete)
      .catch(e => console.log(e, 'Deletion cancelled.'));
  };
  const page = usePage();
  const user = page.props.user as unknown as User;
  const isAdmin = user.roles.some(
    role => role.name === 'super-admin' || role.name === 'admin',
  );
  const allowedAction = isAdmin || !isAdminOnlyAction;
  return (
    <DashboardAdminLayout title={title}>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between mx-8">
          <div className="mt-8 text-2xl">{headerTitle}</div>

          <div className="flex flex-col md:flex-row gap-3">
            {backRoute ? (
              <MuiInertiaLinkButton color="primary" href={backRoute}>
                {backRouteTitle ?? 'Kembali'}
              </MuiInertiaLinkButton>
            ) : null}
            {allowedAction && (
              <>
                {editRoute ? (
                  <MuiInertiaLinkButton color="warning" href={editRoute}>
                    {editRouteTitle ?? 'Edit'}
                  </MuiInertiaLinkButton>
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
              </>
            )}
          </div>
        </div>
        {props.children}
      </div>
    </DashboardAdminLayout>
  );
}
