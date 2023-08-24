import LazyLoadMRT from '@/Components/LazyLoadMRT';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import { ExamModel } from '@/Models/Exam';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { router } from '@inertiajs/react';
import { MRT_ColumnDef, MRT_ColumnFiltersState, MRT_PaginationState } from 'material-react-table';
import React, { useState, useEffect } from 'react';
import route from 'ziggy-js';

interface Props {
    exercise_question: ExerciseQuestionModel;
    exams: ExamModel[];
}

export default function Leaderboard({ exercise_question, exams }: Props) {
    console.log(exams);
    const {
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id
    } =
        useDefaultClassificationRouteParams();




    const dataColumns = [
        { header: 'User', accessorKey: 'user.name' },
        {
            header: 'Waktu Mulai',
            accessorFn: it => new Date(it.created_at).toLocaleString(),
        },
        {
            header: 'Waktu Berakhir',
            accessorFn: it => {
                if (it.finished_at === null) {
                    return 'Belum Selesai';
                }
                return new Date(it.finished_at).toLocaleString();
            },
        },
        {
            header: 'Skor',
            accessorFn: it => {
                return (
                    <>
                        {parseFloat(it.answers_sum_score?.toString() ?? '0')} (
                        {parseFloat(it.answers_sum_score.toString())}/{it.answers_count})
                    </>
                );
            },
        },
    ] as MRT_ColumnDef<ExamModel>[];

    return (
        <AdminTableLayout title={`Riwayat Pengerjaan Latihan Soal ${exercise_question.name}`}>
            <div className="flex justify-between my-3">
                <div className='flex gap-3'>
                    <MuiInertiaLinkButton
                        href={route('packet.sub.category.exercise.export', [
                            learning_packet_id,
                            sub_learning_packet_id,
                            learning_category_id,
                            exercise_question.id,
                        ])}
                        isNextPage
                        color='secondary'
                    >
                        Export Hasil Ujian Keseluruhan
                    </MuiInertiaLinkButton>
                    <MuiInertiaLinkButton
                        href={route('packet.sub.category.exercise.leaderboard', [
                            learning_packet_id,
                            sub_learning_packet_id,
                            learning_category_id,
                            exercise_question.id,
                        ])}
                        color='primary'
                    >
                        Leaderboard
                    </MuiInertiaLinkButton>
                </div>
                <MuiInertiaLinkButton
                    href={route('packet.sub.category.exercise.show', [
                        learning_packet_id,
                        sub_learning_packet_id,
                        learning_category_id,
                        exercise_question.id,
                    ])}
                >
                    Kembali
                </MuiInertiaLinkButton>
            </div>
            <div className="mt-6 p-7 shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 flex flex-col gap-3">
                <p>
                    <span className="font-bold">*Hanya Menampilkan Ujian yang Telah Selesai</span>{' '}
                </p>
                <LazyLoadMRT
                    columns={dataColumns}
                    data={exams}   
                    enableColumnActions
                    enableColumnFilters
                    enablePagination
                    enableSorting
                    enableBottomToolbar
                    enableTopToolbar
                    enableRowActions
                    enableRowNumbers
                    muiTableBodyRowProps={{ hover: false }}
                    muiTableHeadCellProps={{
                        sx: {
                            fontWeight: 'bold',
                            fontSize: '16px',
                        },
                    }}
                    renderRowActions={({ row }) => (
                        <div className="flex items-center justify-center gap-2">
                            <MuiInertiaLinkButton
                                href={route('packet.sub.category.exercise.exam.result',
                                    [
                                        learning_packet_id,
                                        sub_learning_packet_id,
                                        learning_category_id,
                                        exercise_question.id,
                                        row.original.id
                                    ])}
                            >
                                Show
                            </MuiInertiaLinkButton>
                            <MuiInertiaLinkButton
                                href={route('packet.sub.category.exercise.exam.result', [
                                    learning_packet_id,
                                    sub_learning_packet_id,
                                    learning_category_id,
                                    exercise_question.id,
                                    row.original.id,
                                ])}
                                color='secondary'
                            >
                                Lihat Hasil
                            </MuiInertiaLinkButton>
                        </div>
                    )}
                />
            </div>
        </AdminTableLayout>
    );
}