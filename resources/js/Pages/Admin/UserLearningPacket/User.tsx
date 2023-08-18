import React from 'react';
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
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import Api from '@/Utils/Api';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketFormModel } from '@/Models/UserLearningPacket';
import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { router, usePage } from '@inertiajs/react';
import useRoute from '@/Hooks/useRoute';

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
      <Card>
        <CardHeader
          sx={{ px: 2, py: 1 }}
          avatar={
            <Checkbox
              onClick={handleToggleAll(items)}
              checked={
                itemsChecked === items.length && items.length !== 0
              }
              indeterminate={
                itemsChecked !== items.length &&
                itemsChecked !== 0
              }
              disabled={items.length === 0}
              inputProps={{
                'aria-label': 'all items selected',
              }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <List
          sx={{
            width: 200,
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
                  primary={`${value.name} (${value.email})`}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Card>
    );
  };

  let form = useForm<{}>({
    defaultValues: {
    },
  });

  function onSubmit(e: {}) {
    const data = {
      users: registered.map(it => ({ id: it.id })),
    }
    console.log(data);
    router.post(route('user-learning-packet.store-many', [learningPacket.id]), data);
  }

  return (
    <AdminFormLayout
      title="Tambah Paket Belajar Pengguna"
      backRoute={route('user-learning-packet.index')}
      backRouteTitle="Kembali"
    >
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item>{customList('Choices', unregistered)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid item>{customList('Chosen', registered)}</Grid>
      </Grid>
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
    </AdminFormLayout>
  );
}
