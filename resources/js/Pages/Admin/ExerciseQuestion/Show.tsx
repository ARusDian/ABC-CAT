import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import { ExerciseQuestionModel } from '@/Models/ExerciseQuestion';
import React from 'react';
import route from 'ziggy-js';

interface Props {
  exercise_question: ExerciseQuestionModel;
}

export default function Show(props: Props) {
  const { exercise_question } = props;

  return (
    <AdminShowLayout
      title="Latihan Soal"
      headerTitle="Data Latihan Soal"
      editRoute={route('exercise-question.edit', exercise_question.id)}
      backRoute={route('exercise-question.index')}
    >
      {exercise_question.name}
    </AdminShowLayout>
  );
}
