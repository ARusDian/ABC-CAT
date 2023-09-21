import ResultTable from '@/Components/Exam/ResultTable';
import ExamResultDocument from '@/Components/ExamResultDocument';
import KecermatanResultDocument from '@/Components/KecermatanResultDocument';
import MuiInertiaLinkButton from '@/Components/MuiInertiaLinkButton';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import { ExamModel } from '@/Models/Exam';
import { User } from '@/types';
import { Button } from '@mui/material';
import React, { useRef } from 'react';
import Pdf from 'react-to-pdf';
import route from 'ziggy-js';

interface Props {
  exam: ExamModel;
  user: User;
}

export default function ShowResult({ exam, user }: Props) {
  const ref = useRef();

  return (
    <DashboardLayout title="Hasil Pengerjaan Latihan Soal">
      <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#c9d4fc] bg-white">
        <div className="flex justify-between">
          {/* @ts-ignore */}
          <Pdf
            targetRef={ref}
            filename={`Hasil Tes ${exam.exercise_question.name} - ${user.name} No.${exam.id}.pdf`}
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
            href={route('student.exam.show', exam.exercise_question_id)}
          >
            Kembali
          </MuiInertiaLinkButton>
        </div>
        <ResultTable exam={exam} resultRef={ref} />
      </div>
    </DashboardLayout>
  );
}
