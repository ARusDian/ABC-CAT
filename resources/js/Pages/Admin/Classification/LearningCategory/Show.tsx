import AdminNestedShowLayout from "@/Layouts/Admin/AdminNestedShowLayout";
import { LearningCategoryModel } from "@/Models/LearningCategory";
import { Link, router } from "@inertiajs/react";
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import QuizIcon from '@mui/icons-material/Quiz';
import React from "react";
import route from "ziggy-js";
import TableCard from "./TableCard";
import { BaseLearningMaterialDocumentModel } from "@/Models/LearningMaterial";
import { getStorageFileUrl } from "@/Models/FileModel";
import { Button, Tab, Tabs } from "@mui/material";
import useDefaultClassificationRouteParams from "@/Hooks/useDefaultClassificationRouteParams";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            className="text-xl"
            {...other}
        >
            {value === index && <div className="px-5">{children}</div>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface Props {
    learningCategory: LearningCategoryModel
}

export default function Show({ learningCategory }: Props) {

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const {
        learning_packet,
        sub_learning_packet,
        learning_category,
    } = useDefaultClassificationRouteParams();

    return (
        <AdminNestedShowLayout
            title="Kategori Belajar"
            headerTitle="Kategori Belajar"
            backRoute={route('learning-packet.sub-learning-packet.show', {
                learning_packet: learning_packet,
                sub_learning_packet: sub_learning_packet,
            })}
            editRoute={route('learning-packet.sub-learning-packet.edit', {
                learning_packet: learning_packet,
                sub_learning_packet: sub_learning_packet,
                id: learning_category
            })}
            editRouteTitle="Edit"
            onDelete={() => {
                router.delete(route('learning-packet.sub-learning-packet.destroy', {
                    learning_packet: learning_packet,
                    sub_learning_packet: sub_learning_packet,
                    id: learning_category
                }))
            }}
            deleteTitle="Hapus"
        >
            <div className="flex flex-col gap-2">
                <div className="m-8 p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b py-3 border-black">
                                <th className="">Properti</th>
                                <th className="">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b py-3 border-black">
                                <td className="py-3 text-center">Nama</td>
                                <td className="py-3 text-center">{learningCategory.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="mx-auto p-7 text-gray-800 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50">
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        centered
                    >
                        <Tab label="Materi Belajar" {...a11yProps(0)} />
                        <Tab label="Bank Soal" {...a11yProps(1)} />
                        <Tab label="Latihan Soal" {...a11yProps(2)} />
                    </Tabs>
                </div>
            </div>

            <CustomTabPanel value={tabValue} index={0}>
                <TableCard
                    title={<><span className="mx-2 text-gray-600"><LibraryBooksIcon fontSize="large" /></span>Materi Belajar</>}
                    createRoute="learning-packet.sub-learning-packet.learning-category.learning-material.create"
                    createRouteTitle="Tambah Materi"
                    columns={[
                        {
                            header: 'Judul',
                            accessorKey: 'title',
                        }
                    ]}
                    data={learningCategory.learning_materials ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.learning-material.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                    isExpandable
                    detailPanel={(row) => (
                        <div className="flex flex-col gap-3">
                            {row.documents.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b py-3 border-black">
                                            <th className="text-center">Judul Materi</th>
                                            <th className="text-center">Dokumen</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            row.documents.map((document: BaseLearningMaterialDocumentModel) => (
                                                <tr className="border-b py-3 border-black">
                                                    <td className="py-3 text-center">{document.caption}</td>
                                                    <td className="py-3 text-center">
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="large"
                                                            href={getStorageFileUrl(document.document_file) ?? ''}
                                                            target="_blank"

                                                        >
                                                            Lihat Dokumen
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center">Tidak ada dokumen</div>
                            )}
                        </div>
                    )}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <TableCard
                    title={<><span className="mx-2 text-gray-600"><CollectionsBookmarkIcon fontSize="large" /></span>Bank Soal</>}
                    createRoute="learning-packet.sub-learning-packet.learning-category.bank-question.create"
                    createRouteTitle="Tambah Bank Soal"
                    columns={[
                        {
                            header: 'Nama',
                            accessorKey: 'name',
                        }, {
                            header: 'Jumlah Soal',
                            accessorFn: (row) => row.items?.length ?? 0,
                        }
                    ]}
                    data={learningCategory.bank_questions ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.bank-question.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                    isExpandable={false}
                />
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={2}>
                <TableCard
                    title={<><span className="mx-2 text-gray-600"><QuizIcon fontSize="large" /></span>Latihan Soal</>}
                    createRoute="learning-packet.sub-learning-packet.learning-category.exercise-question.create"
                    createRouteTitle="Tambah Latihan Soal"
                    columns={[
                        {
                            header: 'Nama',
                            accessorKey: 'name',
                        }, {
                            header: 'Jumlah Soal',
                            accessorFn: (row) => row.questions?.length ?? 0,
                        }
                    ]}
                    data={learningCategory.exercise_questions ?? []}
                    showRoute="learning-packet.sub-learning-packet.learning-category.exercise-question.show"
                    showRouteTitle="Show"
                    learningPacketId={learningCategory.sub_learning_packet?.learning_packet_id ?? 0}
                    subLearningPacketId={learningCategory.sub_learning_packet_id}
                    learningCategoryId={learningCategory.id}
                />
            </CustomTabPanel>
        </AdminNestedShowLayout >
    )
}
