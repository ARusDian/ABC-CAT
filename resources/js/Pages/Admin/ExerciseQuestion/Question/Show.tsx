import { QuestionModel } from '@/Models/Question';
import React from 'react';
import route from 'ziggy-js';
import parse from 'html-react-parser';
import { Inertia } from '@inertiajs/inertia';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import EditorInput from '@/Components/Tiptap/EditorInput';
import QuestionEditor from '@/Components/QuestionEditor';

interface Props {
  question: QuestionModel;
}

export default function Index(props: Props) {
  const question = props.question;
  return (
    <AdminShowLayout
      title={`Pertanyaan ${question.id}`}
      headerTitle={'Data Pertanyaan'}
      backRoute={route('exercise-question.show', [
        question.exercise_question_id,
      ])}
      backRouteTitle="Kembali"
      editRoute={route('exercise-question.question.edit', [
        question.exercise_question_id,
        question.id,
      ])}
      editRouteTitle="Edit"
      onDelete={() => {
        Inertia.post(route('question.destroy', question.id), {
          _method: 'DELETE',
        });
      }}
      deleteTitle="Hapus"
    >
      <div className="border-2 border-gray-200 p-5">
        <div className="prose mx-auto">
          <QuestionEditor
            content={props.question.question.content}
            exerciseQuestionId={props.question.exercise_question_id}
            disableEdit
          />
        </div>
      </div>
    </AdminShowLayout>
  );
}
