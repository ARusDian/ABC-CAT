import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
} from '@/Components/CustomAccordion';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { LearningPacketModel } from '@/Models/LearningPacket';
import { Assignment, ExpandMore } from '@mui/icons-material';
import { Button } from '@mui/material';
import React from 'react';
import route from 'ziggy-js';

interface Props {
    learningPacket: LearningPacketModel;
}

export default function Index({ learningPacket }: Props) {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');

    const {
        learning_packet,
    } = useDefaultClassificationRouteParams();

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <DashboardLayout title="SubKategori">
            <div className="flex flex-col gap-5 mx-10">
                <div className='flex justify-between'>
                    <p className="text-5xl text-[#3A63F5]">KATEGORI</p>
                    <MuiInertiaLinkButton
                        href={route('dashboard')}
                        color='primary'
                    >
                        Kembali
                    </MuiInertiaLinkButton>
                </div>
                <div className="flex flex-col gap-3">
                    {learningPacket.sub_learning_packets.length > 0 ? (

                        learningPacket.sub_learning_packets.map((subLearningPacket, i) => (
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
                                        <span className="pl-3 ">{subLearningPacket.name}</span>
                                    </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {subLearningPacket.learning_categories && subLearningPacket.learning_categories.length > 0 ? (
                                        <ul className="p-3 flex flex-col gap-3">
                                            {subLearningPacket.learning_categories.map((learningCategory, i) => (
                                                <li className="flex gap-3 w-full" key={i}>
                                                    <div className="grid grid-cols-2 w-full">
                                                        <p className="text-xl my-auto">
                                                            <span className="pr-3">
                                                                <Assignment fontSize="small" />
                                                            </span>
                                                            {i + 1}. {learningCategory.name}
                                                        </p>
                                                        <div className="flex justify-around">
                                                            <MuiInertiaLinkButton
                                                                href={route('student.packet.category.material.index', [
                                                                    learning_packet,
                                                                    subLearningPacket.id,
                                                                    learningCategory.id
                                                                ])}
                                                                color='primary'
                                                            >
                                                                Materi
                                                            </MuiInertiaLinkButton>

                                                            <Button variant="contained" color="success" size="large">
                                                                Latihan
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className='flex justify-center'>
                                            <p className="text-3xl font-bold my-auto">
                                                Tidak Ada Kategori Pembelajaran
                                            </p>
                                        </div>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    ) : (
                        <div className='flex justify-center'>
                            <p className="text-3xl font-bold my-auto">
                                Tidak Ada Sub Paket Pembelajaran
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
