import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { User } from '@/types';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  userData: User;
}

export default function Index({ userData }: Props) {
  return (
    <AdminShowLayout
      title="Kategori Belajar Instruktur"
      headerTitle="Kategori Belajar Instruktur"
    >
      <div className="mt-6 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
        <table className="w-full">
          <thead>
            <tr className="border-b py-3 border-black">
              <th className="">Kategori Belajar Diampu</th>
              <th className="">Paket Belajar </th>
              <th className="">Sub Paket Belajar</th>
              <th>Pintasan</th>
            </tr>
          </thead>
          <tbody>
            {userData.learning_categories?.length &&
            userData.learning_categories?.length > 0 ? (
              userData.learning_categories?.map((category, index) => (
                <tr className="border-b py-3 border-black" key={category.id}>
                  <td className="py-3 text-center">{category.name}</td>
                  <td className="py-3 text-center">
                    {category.sub_learning_packet?.learning_packet?.name}
                  </td>
                  <td className="py-3 text-center">
                    {category.sub_learning_packet?.name}
                  </td>
                  <td className="py-3 text-center">
                    <MuiInertiaLinkButton
                      href={route('packet.sub.category.show', [
                        category.sub_learning_packet?.learning_packet_id,
                        category.sub_learning_packet?.id,
                        category.id,
                      ])}
                    >
                      Lihat
                    </MuiInertiaLinkButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-b py-3 border-black">
                <td className="py-3 text-center" colSpan={3}>
                  Tidak ada kategori belajar yang diampu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShowLayout>
  );
}
