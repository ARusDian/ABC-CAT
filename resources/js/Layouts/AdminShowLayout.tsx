import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';

interface Props {
    title: string;

  backRoute?: string;
  backRouteTitle?: string;

  editRoute?: string;
  editRouteTitle?: string;

  onDelete?: () => any;
  deleteTitle?: string;
}

export default function Index(props: React.PropsWithChildren<Props>) {
  const { title, backRoute, backRouteTitle, editRoute, editRouteTitle, onDelete } =
    props;
  return (
    <DashboardAdminLayout title={title}>
      <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
          <div className="p-6 sm:px-20 bg-white border-b border-gray-200 flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="mt-8 text-2xl">{title}</div>
              <div className="flex flex-col md:flex-row gap-3">
                {backRoute ? (
                  <button>
                    <InertiaLink
                      className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                      href={backRoute}
                    >
                      {backRouteTitle ?? 'Kembali'}
                    </InertiaLink>
                  </button>
                ) : null}

                {editRoute ? (
                  <button>
                    <InertiaLink
                      className="bg-yellow-500 text-white hover:bg-yellow-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                      href={editRoute}
                    >
                      {editRouteTitle ?? 'Edit'}
                    </InertiaLink>
                  </button>
                ) : null}

                {onDelete ? (
                  <div className="flex flex-col justify-center">
                    <button
                      className="bg-red-500 text-white hover:bg-red-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                      onClick={onDelete}
                    >
                      <label htmlFor="my-modal">{deleteTitle ?? 'Hapus'}</label>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>

            {props.children}
            {/* <div className="border-2 border-gray-200 p-5"> */}
            {/*   <div className="prose ">{parse(question.content)}</div> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
