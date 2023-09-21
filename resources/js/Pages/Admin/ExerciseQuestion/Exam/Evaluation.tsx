import { ExamModel } from '@/Models/Exam';
import React from 'react';
import route from 'ziggy-js';
import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import Evaluation from '@/Components/Exam/Evaluation';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';

interface Props {
  exam: ExamModel;
}

export default function ShowAttempt({ exam }: Props) {
  const { learning_packet_id, sub_learning_packet_id, learning_category_id } =
    useDefaultClassificationRouteParams();

  return (
    <AdminShowLayout
      title="Evaluasi Ujian"
      headerTitle="Evaluasi Ujian"
      backRoute={route('packet.sub.category.exercise.exam', [
        learning_packet_id,
        sub_learning_packet_id,
        learning_category_id,
        exam.exercise_question_id,
      ])}
    >
      <div className="flex flex-col w-full h-full p-7 rounded-2xl shadow-2xl shadow-sky-400/50 bg-white">
        <Evaluation exam={exam} />
      </div>
    </AdminShowLayout>
  );
}
