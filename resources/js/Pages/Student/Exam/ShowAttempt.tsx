import { ExamModel } from '@/Models/Exam';
import React from 'react';
import Answer from './Answer';

interface Props {
  exam: ExamModel;
}

export  default function ShowAttempt(props: Props) {
  console.log(props.exam);
  return <div>
    {props.exam.answers.map((it, index) => {

      return <div key={it.id}>
        Soal {index + 1} ({parseFloat(it.score.toString())})
        <Answer answer={it}/>
      </div>
    })}
  </div>;
}
