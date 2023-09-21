import ResultTable from '@/Components/Exam/ResultTable';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import DashboardAdminLayout from '@/Layouts/Admin/DashboardAdminLayout';
import { ExamModel } from '@/Models/Exam';
import { Button } from '@mui/material';
import React, { useRef } from 'react';
import Pdf from 'react-to-pdf';
import route from 'ziggy-js';

interface Props {
  exam: ExamModel;
}

export default function ShowResult({ exam }: Props) {
  const ref = useRef();
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();
  return (
    <DashboardAdminLayout title="Hasil Pengerjaan Latihan Soal">
      <div className="flex flex-col w-full h-full p-7 rounded-2xl shadow-2xl shadow-sky-400/50  bg-white">
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
            href={route('packet.sub.category.exercise.exam', [
              learning_packet_id,
              sub_learning_packet_id,
              learning_category_id,
              exam.exercise_question_id,
            ])}
          >
            Kembali
          </MuiInertiaLinkButton>
        </div>
        <ResultTable exam={exam} resultRef={ref} />
      </div>
    </DashboardAdminLayout>
  );
}
