import { ExamModel } from '@/Models/Exam';
import React from 'react';
import route from 'ziggy-js';
import { asset } from '@/Models/Helper';
import { useSearchParam } from '@/Hooks/useSearchParam';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import AdminTableLayout from '@/Layouts/Admin/AdminTableLayout';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import { ExamNavigation } from '@/Components/ExamNavigation';
import ExamAnswer from '@/Components/ExamAnswer';

interface Props {
    exam: ExamModel;
}

export default function ShowAttempt({ exam }: Props) {
    const currentQuestion =
        (parseInt(useSearchParam('question') ?? '1') || 1) - 1;

    const setCurrentQuestion = React.useCallback((index: number) => {
        const url = new URL(location.toString());
        url.searchParams.set('question', (index + 1).toString());
        history.pushState({}, '', url);
    }, []);

    const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
        useDefaultClassificationRouteParams();

    return (
        <AdminTableLayout title="Hasil Ujian">
            <div className="flex justify-end mb-3">
                <MuiInertiaLinkButton
                    href={route('packet.sub.category.exercise.leaderboard', [
                        learning_packet_id, sub_learning_packet_id, learning_category_id,
                        exam.exercise_question_id,
                    ])}
                >
                    Kembali
                </MuiInertiaLinkButton>
            </div>
            <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#7c98fd]">
                <div className="flex justify-between p-3">
                    <div className="text-4xl">
                        <span className="font-bold">Hasil Ujian</span>
                    </div>

                </div>
                <div className="border-t border-gray-500 w-auto h-auto p-3 flex gap-6 divide-x">
                    <ExamNavigation
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        isEvaluation
                        answers={exam.answers}
                        getState={it => {
                            return {
                                isRight: it.score != 0,
                            };
                        }}
                    />
                    <div className='className="flex flex-col p-3 basis-2/3'>
                        <p className="text-lg font-semibold">
                            {' '}
                            Soal {currentQuestion + 1} (
                            {parseFloat(exam.answers[currentQuestion].score.toString())})
                        </p>
                        <div className="relative flex">
                            <div className="absolute w-full h-full">
                                <div className="flex justify-center h-full w-full p-10" style={{
                                    backgroundImage: `url(${asset('root', 'assets/image/logo.png')})`,
                                    backgroundRepeat: 'repeat-y',
                                    backgroundSize: 'contain',
                                    backgroundPosition: 'center',
                                    opacity: 0.4,
                                }}>
                                </div>
                            </div>
                            <div className="w-full h-auto p-3 flex flex-col gap-3 ">
                                <ExamAnswer answer={exam.answers[currentQuestion]} isEvaluation />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminTableLayout>
    );
}
