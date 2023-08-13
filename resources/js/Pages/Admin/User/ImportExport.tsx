import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { BaseDocumentFileModel } from '@/Models/FileModel';
import Api from '@/Utils/Api';
import { Button } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import route from 'ziggy-js';

interface ImportFileModel {
  import_file: BaseDocumentFileModel;
}

export default function ImportExport() {
  const form = useForm<ImportFileModel>();

  function onSubmit(e: any) {
    Api.post(route('user.import'), e, form);
  }

  return (
    <DashboardAdminLayout title="Import/Export Users">
      <div>
        <form
          className="flex-col gap-5 py-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex justify-center">
            <Controller
              name="import_file"
              control={form.control}
              render={({ field }) => (
                <input
                  type="file"
                  ref={field.ref}
                  className=""
                  onChange={e => {
                    field.onChange({
                      file: e.target.files![0],
                      path: '',
                      disk: 'public',
                    });
                  }}
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              color="primary"
            >
              Import Student
            </Button>
          </div>
        </form>
        <MuiInertiaLinkButton
          href={route('user.export')}
          color="primary"
          isNextPage
        >
          Export
        </MuiInertiaLinkButton>
        <MuiInertiaLinkButton href={route('user.index')} color="primary">
          Kembali
        </MuiInertiaLinkButton>
      </div>
    </DashboardAdminLayout>
  );
}
