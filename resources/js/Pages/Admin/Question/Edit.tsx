import React from 'react';
import route from 'ziggy-js';

import DashboardAdminLayout from '@/Layouts/DashboardAdminLayout';
import { InertiaLink, useForm } from '@inertiajs/inertia-react';

import Form from './Form';
import { BaseQuestionModel, QuestionModel } from '@/Models/Question';
import AdminFormLayout from '@/Layouts/AdminFormLayout';
import { Button } from '@mui/material';

interface Props {
    question: QuestionModel,
}

export default function Edit(props: Props) {
    const question = props.question;
    let form = useForm<BaseQuestionModel>(
        {
            content: question.content,
            images : []
        }
    );

    function onSubmit(e: React.FormEvent) {
        console.log(form.data);
        e.preventDefault();
        form.clearErrors();
        // php does'nt support PUT so...
        // @ts-ignore
        form.data._method = 'PUT';
        form.post(route('question.update', question.id), {
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
            title="Edit Pertanyaan"
            backRoute={route('question.show', question.id)}
            backRouteTitle="Kembali"
        >
            <form className="flex-col gap-5 py-5" onSubmit={onSubmit}>
                <Form

                    form={form}
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
