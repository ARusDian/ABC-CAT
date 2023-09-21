import React from 'react';
import KecermatanResultDocument from '../KecermatanResultDocument';
import { ExamModel } from '@/Models/Exam';
import ExamResultDocument from '../ExamResultDocument';
import KepribadianResultDocument from '../KepribadianResultDocument';

interface Props {
  exam: ExamModel;
  resultRef: React.MutableRefObject<any>;
}

export default function Result({ exam, resultRef }: Props) {
  return (
    <div className="border border-black mx-auto">
      <div
        // @ts-ignore
        ref={resultRef}
        style={{ width: '795px' }}
        className=" bg-white flex flex-col gap-1 w-full flex-1 p-1"
      >
        {exam.exercise_question.type === 'Kecermatan' ? (
          <KecermatanResultDocument exam={exam} user={exam.user} />
        ) : exam.exercise_question.type == 'Kepribadian' ? (
          <KepribadianResultDocument exam={exam} user={exam.user} />
        ) : (
          <ExamResultDocument exam={exam} user={exam.user} />
        )}
      </div>
    </div>
  );
}
