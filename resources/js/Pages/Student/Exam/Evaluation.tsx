import { ExamModel } from '@/Models/Exam';
import React from 'react';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';
import route from 'ziggy-js';
import { useSearchParam } from '@/Hooks/useSearchParam';
import Evaluation from '@/Components/Exam/Evaluation';
import LinkButton from '@/Components/LinkButton';

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

  return (
    <DashboardLayout title="Evaluasi">
      <div className="flex justify-end my-3">
        <div className="text-lg">
          <LinkButton
            href={route('student.exam.show', exam.exercise_question_id)}
            colorCode="#3A63F5"
            className="px-5 rounded-md"
          >
            Kembali
          </LinkButton>
        </div>
      </div>
      <div className="flex flex-col shadow-lg w-full h-full p-7 rounded-2xl shadow-[#c9d4fc] bg-white">

        <Evaluation
          exam={exam}
        />
      </div>
    </DashboardLayout>
  );
}
