import React from 'react';
import route from 'ziggy-js';

import AppLayout from '@/Layouts/DashboardAdminLayout';
import { NewUser, Role } from '@/types';
import { InertiaLink, useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import AdminFormLayout from '@/Layouts/AdminFormLayout';
import { Button } from '@mui/material';

interface Props{
    roles : Array<Role>,
}

export default function Create(props: Props) {
    let form = useForm <NewUser>(
        {
            name: '',
            email: '',
            phone_number: '',
            password: '',
            roles: [],
        }
    );

    function onSubmit(e: React.FormEvent) {
        console.log(form.data);
        e.preventDefault();
        form.clearErrors();
        form.post(route('user.store'), {
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
            title="Tambah User"
            backRoute={route('user.index')}
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
                        color='primary'
                        size="large"
                        disabled={form.processing}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </AdminFormLayout>
    )
}
