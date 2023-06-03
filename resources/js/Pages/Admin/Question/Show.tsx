import DashboardAdminLayout from "@/Layouts/DashboardAdminLayout";
import { QuestionModel } from "@/Models/Question";
import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";
import route from "ziggy-js";
import parse from 'html-react-parser';
import { Inertia } from "@inertiajs/inertia";
import { Dialog, DialogContent } from "@mui/material";

interface Props {
    question: QuestionModel;
}

export default function Index(props: Props) {
    const question = props.question;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <DashboardAdminLayout title="question">
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
                    <div className="p-6 sm:px-20 bg-white border-b border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between">
                            <div className="mt-8 text-2xl">
                                Pertanyaan
                            </div>
                            <div className="flex flex-col md:flex-row gap-3">
                                <button>
                                    <InertiaLink
                                        className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                        href={route('question.index')}
                                    >
                                        Kembali
                                    </InertiaLink>
                                </button>
                                <button>
                                    <InertiaLink
                                        className="bg-yellow-500 text-white hover:bg-yellow-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                        href={route('question.edit', question.id)}
                                    >
                                        Edit
                                    </InertiaLink>
                                </button>
                                <div className="flex flex-col justify-center" >
                                    <button
                                        className="bg-red-500 text-white hover:bg-red-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                        onClick={handleClickOpen}
                                    >
                                        <label htmlFor="my-modal">Delete</label>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="border-2 border-gray-200 p-5">
                            <div
                                className='prose '
                            >
                                {parse(question.content)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog open={open} onClose={handleClose}
            >
                <DialogContent className="w-full">
                    <div>
                        <h3 className="font-bold text-lg">Confirm to Delete</h3>
                        <p className="py-4">Are you sure to do this.</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white hover:bg-red-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                onClick={
                                    () => {
                                        Inertia.post(route('question.destroy', question.id), {
                                            _method: 'DELETE',
                                        });
                                    }
                                }
                            >Yes</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DashboardAdminLayout>
    );
}
