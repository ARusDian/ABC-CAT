import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import PDFViewer from '@/Components/PDFViewer';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { BaseLearningMaterialDocumentModel } from '@/Models/LearningMaterial';
import React from 'react';
import route from 'ziggy-js';

interface Props {
    document: BaseLearningMaterialDocumentModel;
}

export default function Index({ document }: Props) {

    console.log(document);

    const {
        learning_packet,
        sub_learning_packet,
        learning_category,
    } = useDefaultClassificationRouteParams();

    return (
        <DashboardLayout title="DOKUMEN Materi">
            <div className="flex flex-col gap-5 mx-10">
                <div className='flex justify-between'>
                    <p className="text-5xl text-[#3A63F5]">{document.caption}</p>
                    <MuiInertiaLinkButton
                        href={route('student.packet.category.material.index', [
                            learning_packet,
                            sub_learning_packet,
                            learning_category,
                        ])}
                        color='primary'
                    >
                        Kembali
                    </MuiInertiaLinkButton>
                </div>
                <div className="p-5 rounded-lg border overflow-hidden shadow-2xl sm:rounded-3xl flex flex-col gap-3">
                    <div className=''>
                        <PDFViewer document={document} height='1200px' />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
