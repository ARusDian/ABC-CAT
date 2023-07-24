import { ExamModel } from '@/Models/Exam';
import React from 'react';
import Answer from './Answer';
import DashboardLayout from '@/Layouts/Student/DashboardLayout';

interface Props {
  exam: ExamModel;
}

export default function ShowAttempt(props: Props) {
  console.log(props.exam);
  return (
    <DashboardLayout
      title="Evaluasi"
    >
      <div className="flex flex-col">
        <div className="flex justify-between p-3">
          <div className="text-4xl">
            <span className="font-bold">Evaluasi </span>
          </div>
          <div className="text-lg">
          </div>
        </div>
        <div className="border-t border-gray-500 w-auto h-auto p-3 flex flex-col gap-6">
          {props.exam.answers.map((it, index) => {

            return <div key={it.id}>
              Soal {index + 1} ({parseFloat(it.score.toString())})
              <Answer answer={it} />
            </div>
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
