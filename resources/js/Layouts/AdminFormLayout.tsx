import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';
import DashboardAdminLayout from './DashboardAdminLayout';

export interface Props {
  title: string;

  back_route?: string;
  back_route_title?: string;
}

export default function AdminFormLayout(props: React.PropsWithChildren<Props>) {
  return (
    <DashboardAdminLayout title={'Tambah User'}>
      <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
          <div className="flex justify-between">
            <div className="text-2xl">Tambah Soal</div>
            {props.back_route ? (
              <button className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold">
                <InertiaLink href={route(props.back_route)}>
                  {props.back_route_title ?? "Kembali" }
                </InertiaLink>
              </button>
            ) : null}
          </div>

          {props.children}
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
