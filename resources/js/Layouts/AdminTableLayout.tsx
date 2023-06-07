import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';
import DashboardAdminLayout from './DashboardAdminLayout';

export interface Props {
  title: string;

  add_route?: string;
  add_route_title?: string;
}

export default function AdminTableLayout(
  props: React.PropsWithChildren<Props>,
) {
  return (
    <DashboardAdminLayout title={props.title}>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <div className="p-6 sm:px-20 bg-white border-b border-gray-200">
              <div className="flex justify-between">
                <div className="mt-8 text-2xl">{props.title}</div>
                <div className="">
                  {props.add_route ? (
                    <InertiaLink
                      href={route(props.add_route)}
                      className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold"
                    >
                      {props.add_route_title
                        ? props.add_route_title
                        : `Tambah ${props.title}`}
                    </InertiaLink>
                  ) : null}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
