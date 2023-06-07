import React from 'react';
import route from 'ziggy-js';

import AppLayout from '@/Layouts/DashboardAdminLayout';
import { NewUser, Role } from '@/types';
import { InertiaLink, useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/AdminFormLayout';
import { Button } from '@mui/material';


interface Props {
    user: NewUser;
    roles: Array<Role>;
}

export default function Edit(props: Props) {
    let user = props.user;
    let form = useForm<NewUser>(
        {
            ...user,
        }
    );

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.clearErrors();
        // php does'nt support PUT so...
        // @ts-ignore
        form.data._method = 'PUT';
        form.post(route('user.update', user.id), {
            onError: (errors) => {
                console.log(errors);
            },
            onSuccess: () => {
                console.log('success');
            }
        });
    }

    return (
        <AdminFormLayout
            title="Edit User"
            backRoute={route('user.show', user.id)}
            backRouteTitle="Kembali"
        >
            <form className="flex-col gap-5 py-5" onSubmit={onSubmit}>
                <Form
                    form={form}
                    roles={props.roles}
                    className="my-5 mx-2"
                />
                <div className="flex justify-end">
                    <Button
                        type="submit"
                        variant="contained"
                        color='warning'
                        size="large"
                        disabled={form.processing}
                    >
                        Update
                    </Button>
                </div>
            </form>
        </AdminFormLayout>
    )
}
