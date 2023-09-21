import useDefaultClassificationRouteParams from '@/Hooks/useDefaultClassificationRouteParams';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExamModel } from '@/Models/Exam';
import { router } from '@inertiajs/react';
import React from 'react';
import { useIdle, useInterval } from 'react-use';
import { useSearchParam } from '@/Hooks/useSearchParam';
import route from 'ziggy-js';
import { ExamNavigation } from '@/Components/ExamNavigation';
import ExamAnswer from '@/Components/ExamAnswer';
import { asset } from '@/Models/Helper';
import Evaluation from '@/Components/Exam/Evaluation';

interface Props {
  exam: ExamModel;
}

export default function Show(props: Props) {
  const { exam } = props;

  return (
    <AdminShowLayout
      title="Evaluasi Ujian"
      headerTitle="Evaluasi Ujian"
      backRoute={route('user.exam.index', [exam.user.id])}
    >
      <div className="flex flex-col w-full h-full p-7 rounded-2xl shadow-2xl shadow-sky-400/50 bg-white">
        <Evaluation exam={exam} />
      </div>
    </AdminShowLayout>
  );
}
