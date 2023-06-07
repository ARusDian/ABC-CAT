import DashboardAdminLayout from "@/Layouts/DashboardAdminLayout";
import { InertiaLink } from "@inertiajs/inertia-react";
import React from "react";
import route from "ziggy-js";
import parse from 'html-react-parser';
import { Inertia } from "@inertiajs/inertia";
import { Dialog, DialogContent } from "@mui/material";
import {  LearningMaterialModel } from "@/Models/LearningMaterial";
import PDFViewer from "@/Components/PDFViewer";

interface Props {
    learningMaterial: LearningMaterialModel;
}

export default function Index(props: Props) {
    const learningMaterial = props.learningMaterial;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log(learningMaterial.documents);
    return (
        <DashboardAdminLayout title="Materi Pembelajaran">
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-3">
                    <div className="p-6 sm:px-20 bg-white border-b border-gray-200 flex flex-col gap-3">
                        <div className="flex justify-between">
                            <div className="mt-8 text-2xl">
                                Materi Pembelajaran
                            </div>
                            <div className="flex flex-col md:flex-row gap-3">
                                <button>
                                    <InertiaLink
                                        className="bg-blue-500 text-white hover:bg-blue-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                        href={route('learning-material.index')}
                                    >
                                        Kembali
                                    </InertiaLink>
                                </button>
                                <button>
                                    <InertiaLink
                                        className="bg-yellow-500 text-white hover:bg-yellow-600 py-3 px-5 rounded-lg text-md font-semibold focus:outline-none border-2"
                                        href={route('learning-material.edit', learningMaterial.id)}
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
                        <div>
                            <div className="text-xl font-bold">{learningMaterial.title}</div>
                        </div>
                        <div>Deskripsi Materi Pembelajaran :</div>
                        <div className="border-2 border-gray-200 p-5">
                            <div
                                className='prose '
                            >
                                {parse(learningMaterial.description)}
                            </div>
                        </div>
                        <div className="mt-8 text-2xl">
                            Dokumen Materi Pembelajaran
                        </div>
                        <div className="flex flex-col gap-2">
                            {learningMaterial.documents.length > 0 && (
                                learningMaterial.documents.map((document, index) => {

                                    return (
                                        <div key={document.id} className='border-b-2 pb-5'>
                                            <div className="my-5 flex flex-col gap-2">
                                                <div className="flex-1">
                                                    <label className="label" htmlFor={`document_name_${index}`}>
                                                        Nama Dokumen
                                                    </label>
                                                    <input
                                                        id={`document_name_${index}`}
                                                        key={`document-${document.id}-name`}
                                                        type="text"
                                                        className="input w-full"
                                                        required
                                                        value={document.caption}
                                                        disabled
                                                    />
                                                </div>
                                                <PDFViewer
                                                    document={document}
                                                />
                                            </div>
                                        </div>
                                    )
                                })
                            )}
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
                                        Inertia.post(route('learning-material.destroy', learningMaterial.id), {
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

