import React, { useEffect } from 'react';
import route, { RouteParams } from 'ziggy-js';

import { User } from '@/types';

import Form from './Form';
import AdminFormLayout from '@/Layouts/Admin/AdminFormLayout';
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Grid,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import _, { set } from 'lodash';
import Api from '@/Utils/Api';
import { LearningPacketModel } from '@/Models/LearningPacket';
import {
  UserLearningPacketFormModel,
  UserLearningPacketModel,
} from '@/Models/UserLearningPacket';
import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { router, usePage } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';
import InputError from '@/Components/Jetstream/InputError';
import FilterForm from './FilterForm';
import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';

interface Props {
  learningPacket: LearningPacketModel;
  unregisteredUsers: Array<User>;
}

function indexOf(list: readonly User[], user: User) {
  return list.findIndex(it => it.id == user.id);
}

function not(a: readonly User[], b: readonly User[]) {
  return a.filter(value => indexOf(b, value) === -1);
}

function intersection(a: readonly User[], b: readonly User[]) {
  return a.filter(value => indexOf(b, value) !== -1);
}

function union(a: readonly User[], b: readonly User[]) {
  return [...a, ...not(b, a)];
}

export default function Create({ unregisteredUsers, learningPacket }: Props) {
  const [checked, setChecked] = React.useState<readonly User[]>([]);
  const [unregistered, setUnregistered] =
    React.useState<User[]>(unregisteredUsers);
  const [registered, setRegistered] = React.useState<User[]>(
    learningPacket.users!,
  );

  const leftChecked = intersection(checked, unregistered);
  const rightChecked = intersection(checked, registered);

  const handleToggle = (value: User) => () => {
    const currentIndex = checked.findIndex(it => it.id == value.id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly User[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly User[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRegistered(registered.concat(leftChecked));
    setUnregistered(not(unregistered, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setUnregistered(unregistered.concat(rightChecked));
    setRegistered(not(registered, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const customList = (title: React.ReactNode, items: User[]) => {
    const itemsChecked = numberOfChecked(items);

    return (
      <div>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={itemsChecked === items.length && items.length !== 0}
              indeterminate={
                itemsChecked !== items.length && itemsChecked !== 0
              }
              disabled={items.length === 0}
              inputProps={{
                'aria-label': 'all items selected',
              }}
            />
          }
          title={<p className="text-xl">{title}</p>}
          subheader={`${numberOfChecked(items)}/${items.length} Dipilih`}
        />
        <Divider />
        <List
          sx={{
            height: 230,
            bgcolor: 'background.paper',
            overflow: 'auto',
          }}
          dense
          component="div"
          role="list"
        >
          {items.map((value: User) => {
            const labelId = `transfer-list-all-item-{value.id}-label`;

            return (
              <ListItemButton
                key={value.id}
                role="listitem"
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={indexOf(checked, value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      'aria-labelledby': labelId,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={`${value.name} (${value.email}) - ${value.active_year}`}
                />
              </ListItemButton>
            );
          })}
        </List>
      </div>
    );
  };

  let form = useForm<{
    subscription_date: string;
  }>({
    defaultValues: {
      subscription_date: new Date().toISOString().split('T')[0],
    },
  });

  function onSubmit(e: {}) {
    const data = {
      users: registered.map(it => ({ id: it.id })),
    };
    router.post(route('user-learning-packet.store-many', [learningPacket.id]), {
      ...data,
      ...form.getValues(),
    });
  }

  return (
    <DashboardAdminLayout title="Tambah Paket Belajar Pengguna">
      <div className=" flex flex-col gap-3  mx-8">
        <div className="flex justify-between">
          <p className="my-8 text-2xl">
            Langganan Paket Belajar {learningPacket.name}
          </p>
          <MuiInertiaLinkButton href={route('user-learning-packet.index')}>
            Kembali
          </MuiInertiaLinkButton>
        </div>

        <div className="grid grid-cols-3 gap-2 justify-center items-center">
          <div className="flex flex-col gap-3  rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white">
            <FilterForm
              title="Filter Pengguna Belum Terdaftar"
              users={unregisteredUsers.filter(
                it => !registered.find(user => user.id == it.id),
              )}
              onFilter={setUnregistered}
            />
            <div className="border-t-2 my-3">
              {customList('Pengguna Belum Terdaftar', unregistered)}
            </div>
          </div>
          <div className="mx-auto">
            <div className="flex flex-col gap-3  items-center rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white">
              <Button
                variant="contained"
                size="large"
                color={leftChecked.length > 0 ? 'primary' : 'inherit'}
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
                aria-label="move selected right"
              >
                <p className="text-xl"> &gt; </p>
              </Button>
              <Button
                variant="contained"
                size="large"
                color={rightChecked.length > 0 ? 'primary' : 'inherit'}
                onClick={handleCheckedLeft}
                disabled={rightChecked.length === 0}
                aria-label="move selected left"
              >
                <p className="text-xl"> &lt; </p>
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3  rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white">
            <FilterForm
              title="Filter Pengguna Berlangganan"
              users={
                learningPacket.users
                  ? learningPacket.users.filter(
                      it => !unregistered.find(user => user.id == it.id),
                    )
                  : []
              }
              onFilter={setRegistered}
            />
            <div className="border-t-2 my-3">
              {customList('Pengguna Berlangganan', registered)}
            </div>
          </div>
        </div>
        <div className="form-control w-full mt-4">
          <Controller
            control={form.control}
            name="subscription_date"
            render={({ field }) => {
              return (
                <>
                  <InputLabel htmlFor="subscription_date">
                    Tanggal Berlangganan
                  </InputLabel>
                  <input type="date" className="mt-1 block w-full" {...field} />
                  <InputError
                    message={form.formState.errors.subscription_date?.message}
                    className="mt-2"
                  />
                </>
              );
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={form.formState.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
        <div className="flex flex-col gap-3  rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white">
          <p className="text-xl">Daftar Pengguna Berlangganan</p>
          <LazyLoadMRT
            data={learningPacket.user_learning_packets ?? []}
            columns={[
              {
                header: 'Nama',
                accessorKey: 'user.name',
              },
              {
                header: 'Email',
                accessorKey: 'user.email',
              },
              {
                header: 'Tahun Aktif',
                accessorKey: 'user.active_year',
              },
              {
                header: 'Tanggal Berlangganan',
                accessorFn: ({ subscription_date }: UserLearningPacketModel) =>
                  new Date(subscription_date).toLocaleDateString(),
              },
            ]}
            enableColumnActions
            enableColumnFilters
            enablePagination
            enableSorting
            enableBottomToolbar
            enableTopToolbar
            enableRowNumbers
            muiTableBodyRowProps={{ hover: false }}
            muiTableHeadCellProps={{
              sx: {
                fontWeight: 'bold',
                fontSize: '16px',
              },
            }}
          />
        </div>
      </div>
    </DashboardAdminLayout>
  );
}
