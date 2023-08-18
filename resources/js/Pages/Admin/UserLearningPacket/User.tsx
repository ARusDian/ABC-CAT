import React from 'react';
import route, { RouteParams } from 'ziggy-js';

import { User } from '@/types';

import Form from './Form';
import { Button, Card, CardHeader, Checkbox, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import Api from '@/Utils/Api';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { UserLearningPacketFormModel } from '@/Models/UserLearningPacket';
import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';

interface Props {
    learningPacket: LearningPacketModel;
    unregisteredUsers: Array<User>;
}

function not(a: readonly User[], b: readonly User[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly User[], b: readonly User[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly User[], b: readonly User[]) {
    return [...a, ...not(b, a)];
}


export default function Create({ unregisteredUsers, learningPacket }: Props) {

    const [checked, setChecked] = React.useState<readonly User[]>([]);
    const [left, setLeft] = React.useState<readonly User[]>(unregisteredUsers);
    const [right, setRight] = React.useState<readonly User[]>(learningPacket.users ?? []);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: User) => () => {
        const currentIndex = checked.indexOf(value);
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
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title: React.ReactNode, items: readonly User[]) => (
        <div className='rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white'>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={
                            numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                        }
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={<p className='text-xl'>
                    {title}
                </p>}
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
                    const labelId = `transfer-list-all-item-${value.id}-label`;

                    return (
                        <ListItemButton
                            key={value.id}
                            role="listitem"
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value.name} - ${value.email}`} />
                        </ListItemButton>
                    );
                })}
            </List>
        </div>
    );

    let form = useForm<UserLearningPacketFormModel>({
        defaultValues: {
            subscription_date: new Date().toISOString().split('T')[0],

        },
    });

    function onSubmit(e: UserLearningPacketFormModel) {
        // Api.post(route('user-learning-packet.store'), e, form);
    }

    return (
        <DashboardAdminLayout
            title="Tambah Paket Belajar Pengguna"
        >
            <div className=' flex flex-col gap-3  mx-8'>
                <p className='my-8 text-2xl'>
                    Langganan Paket Belajar {learningPacket.name}
                </p>
                <div className='grid grid-cols-3 gap-2 justify-center items-center'>
                    <div>{customList('Pengguna Belum Terdaftar', left)}</div>
                    <div className='mx-auto'>
                        <div className='flex flex-col gap-3  items-center rounded-3xl shadow-2xl shadow-sky-400/50 p-3 bg-white'>
                            <Button
                                variant="contained"
                                size="large"
                                color={leftChecked.length > 0 ? 'primary' : 'inherit'}
                                onClick={handleCheckedRight}
                                disabled={leftChecked.length === 0}
                                aria-label="move selected right"
                            >
                               <p className='text-xl'> &gt; </p>
                            </Button>
                            <Button
                                variant="contained"
                                size="large"
                                color={rightChecked.length > 0 ? 'primary' : 'inherit'}
                                onClick={handleCheckedLeft}
                                disabled={rightChecked.length === 0}
                                aria-label="move selected left"
                            >
                                <p className='text-xl'> &lt; </p>
                            </Button>
                        </div>
                    </div>
                    <div>{customList('Pengguna Berlangganan', right)}</div>
                </div>
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={form.formState.isSubmitting}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
        </DashboardAdminLayout>
    );
}
