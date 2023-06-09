import React from 'react';
import route from 'ziggy-js';
import { User } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';

interface Props {
  user: User;
}

export default function Show(props: Props) {
  let user = props.user;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AdminShowLayout
      title={`Pengguna ${user.name}`}
      headerTitle={'Data User'}
      backRoute={route('user.index')}
      backRouteTitle="Kembali"
      editRoute={route('user.edit', user.id)}
      editRouteTitle="Edit"
      onDelete={() => {
        Inertia.post(route('user.destroy', user.id), {
          _method: 'DELETE',
        });
      }}
      deleteTitle="Hapus"
    >
      <div className="">
        <table className="w-full">
          <thead>
            <tr className="border-b py-3 border-black">
              <th className="">Properti</th>
              <th className="">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">Nama</td>
              <td className="py-3 text-center">{user.name}</td>
            </tr>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">Email</td>
              <td className="py-3 text-center">{user.email}</td>
            </tr>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">No Telepon</td>
              <td className="py-3 text-center">{user.phone_number}</td>
            </tr>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">Status</td>
              <td className="py-3 text-center">
                {user.roles.map(role => role.name).join(', ')}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminShowLayout>
  );
}
