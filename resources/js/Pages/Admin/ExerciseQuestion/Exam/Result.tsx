import ExamResultDocument from '@/Components/ExamResultDocument';
import KecermatanResultDocument from '@/Components/KecermatanResultDocument';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { ExamModel } from '@/Models/Exam';
import { User } from '@/types';
import { Button } from '@mui/material';
import React, { useRef } from 'react';
import Pdf from 'react-to-pdf';
import route from 'ziggy-js';

interface Props {
  exam: ExamModel;
}

export default function ShowResult({ exam }: Props) {
  const ref = useRef();
  console.log(exam);
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();
  return (
    <DashboardLayout title="Hasil Pengerjaan Latihan Soal">
      <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#c9d4fc] bg-white">
        <div className="flex justify-between">
          {/* @ts-ignore */}
          <Pdf
            targetRef={ref}
            filename={`Hasil Tes ${exam.exercise_question.name} - ${exam.user.name} No.${exam.id}.pdf`}
            scale={1}
          >
            {({ toPdf }: never) => (
              <Button
                variant="contained"
                size="large"
                color="success"
                onClick={toPdf}
              >
                Generate Pdf
              </Button>
            )}
          </Pdf>
          <MuiInertiaLinkButton
            href={route('packet.sub.category.exercise.leaderboard', [
              learning_packet_id,
              sub_learning_packet_id,
              learning_category_id,
              exam.exercise_question_id,
            ])}
          >
            Kembali
          </MuiInertiaLinkButton>
        </div>
        <div className="border border-black mx-auto">
          {/* @ts-ignore */}
          <div
            ref={ref}
            style={{ width: '795px' }}
            className=" bg-white flex flex-col gap-1 w-full flex-1 p-1"
          >
            {exam.exercise_question.type === 'Kecermatan' ? (
              <KecermatanResultDocument exam={exam} user={exam.user} />
            ) : (
              <ExamResultDocument exam={exam} user={exam.user} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
