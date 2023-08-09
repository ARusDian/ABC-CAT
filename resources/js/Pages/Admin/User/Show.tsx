import React from 'react';
import route from 'ziggy-js';
import { User } from '@/types';
import { router } from '@inertiajs/react';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import { asset } from '@/Models/Helper';

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
        router.post(route('user.destroy', user.id), {
          _method: 'DELETE',
        });
      }}
      deleteTitle="Hapus"
    >
      <div className="m-8 mb-12 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
        <div className='flex justify-end my-3'>

          <MuiInertiaLinkButton
            color="success"
            href={route('user-learning-packet.create', {
              user: user.id,
            })}
          >
            Tambah Langganan Paket Belajar
          </MuiInertiaLinkButton>
        </div>
        <div className='flex justify-center'>
          <img
            className="rounded-full h-40 w-40 object-cover border"
            src={user.profile_photo_path ? asset('public', user.profile_photo_path) : asset('root', 'assets/image/default-profile.png')}
            alt={user.name}
          />
        </div>
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
              <td className="py-3 text-center">Tahun Aktif</td>
              <td className="py-3 text-center">{user.active_year}</td>
            </tr>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">Alamat</td>
              <td className="py-3 text-center">{user.address}</td>
            </tr>
            <tr className="border-b py-3 border-black">
              <td className="py-3 text-center">Gender</td>
              <td className="py-3 text-center">{user.gender === 'L' ? "Laki laki" : (user.gender === 'P' ? "Perempuan" : "Tidak Diketahui")}</td>
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
