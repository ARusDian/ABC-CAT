import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@/Components/CustomAccordion';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { LearningMaterialModel } from '@/Models/LearningMaterial';
import { Assignment, ExpandMore } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import route from 'ziggy-js';

interface Props {
    learningMaterials: LearningMaterialModel[];
}

export default function Index({ learningMaterials }: Props) {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const {
        learning_packet,
        sub_learning_packet,
        learning_category,
    } = useDefaultClassificationRouteParams();

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <DashboardLayout title="Daftar Materi">
            <div className="flex flex-col gap-5 mx-10">
                <div className='flex justify-between'>
                    <p className="text-5xl text-[#3A63F5]">Daftar Materi</p>
                    <MuiInertiaLinkButton
                        href={route('student.packet.show', learning_packet)}
                        color='primary'
                    >
                        Kembali
                    </MuiInertiaLinkButton>
                </div>
                <div className="flex flex-col gap-3">
                    {learningMaterials.length > 0 ? (

                        learningMaterials.map((learningMaterial, i) => (
                            <Accordion
                                className="rounded-lg shadow-2xl"
                                expanded={expanded === `panel${++i}`}
                                onChange={handleChange(`panel${i}`)}
                                key={i}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <p className="text-3xl">
                                        <Assignment fontSize="large" />
                                        <span className="pl-3 ">{learningMaterial.title}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div>
                                        <div className=''>
                                            {/* Deskripsi */}
                                        </div>
                                        {learningMaterial.documents && learningMaterial.documents.length > 0 ? (
                                            <ul className="p-3 flex flex-col gap-3">
                                                {learningMaterial.documents.map((document, i) => (
                                                    <li className="flex gap-3 w-full" key={i}>
                                                        <div className="grid grid-cols-2 w-full">
                                                            <p className="text-xl my-auto">
                                                                <span className="pr-3">
                                                                    <Assignment fontSize="small" />
                                                                </span>
                                                                {i + 1}. {document.caption}
                                                            </p>
                                                            <div className="flex justify-around">
                                                                <MuiInertiaLinkButton
                                                                    href={route('student.packet.category.material.show', [
                                                                        learning_packet,
                                                                        sub_learning_packet,
                                                                        learning_category,
                                                                        document.id as unknown as string,
                                                                    ])}
                                                                    color='primary'
                                                                >
                                                                    Dokumen
                                                                </MuiInertiaLinkButton>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className='flex justify-center'>
                                                <p className="text-2xl font-semibold my-auto">
                                                    Tidak Ada Dokumen
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <div className='flex justify-center'>
                            <p className="text-3xl font-bold my-auto">
                                Tidak Ada Materi
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
