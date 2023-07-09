import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import { InertiaLink } from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Show(props: Props) {
  console.log(props);

  return (
    <>
      {props.exercise_question.name}

      <InertiaLink
        href={route('exam.attempt', [props.exercise_question.id])}
        method="POST"
      >
        Attempt
      </InertiaLink>
    </>
  );
}
