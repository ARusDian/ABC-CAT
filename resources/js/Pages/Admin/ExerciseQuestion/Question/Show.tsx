import { QuestionModel } from '@/Models/Question';
import React from 'react';
import route from 'ziggy-js';
import parse from 'html-react-parser';
import { Inertia } from '@inertiajs/inertia';
import AdminShowLayout from '@/Layouts/Admin/AdminShowLayout';
import EditorInput from '@/Components/Tiptap/EditorInput';
import QuestionEditor from '@/Components/QuestionEditor';
import { numberToUpperCase } from '@/Utils/Convert';

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
        question.is_active ?
        Inertia.delete(route('exercise-question.question.destroy', [
          question.exercise_question_id,
          question.id,
        ])) :
          Inertia.post(route('exercise-question.question.restore', [
            question.exercise_question_id,
            question.id,
          ]))
      }}
      deleteTitle={question.is_active ? 'Hapus' : 'Restore'}
      onDeleteMessage={question.is_active ? `Ini akan menghapus pertanyaan.` : `Ini akan mengembalikan pertanyaan.`}
      isRestore={!question.is_active}
    >
      <div className="border-2 border-gray-200 p-5">
        <label>Pertanyaan</label>
        <div className="mx-auto border">
          <QuestionEditor
            content={props.question.question.content}
            exerciseQuestionId={props.question.exercise_question_id}
            disableEdit
          />
        </div>
      </div>
      {
        props.question.type == 'Pilihan' ? (
          <div className="border-2 border-gray-200 p-5">
            <label>Pilihan Ganda :</label>
            {
              props.question.answers.choices.map((choice, index) => {
                return (
                  <div key={index}>
                    <label>Pilihan {numberToUpperCase(index)}</label>
                    <div className="mx-auto border">
                      <QuestionEditor
                        content={choice.content}
                        exerciseQuestionId={props.question.exercise_question_id}
                        disableEdit
                      />
                    </div>
                  </div>
                )
              })
            }
          </div>
        ) : (
          <div className="border-2 border-gray-200 p-5">
            <label>Jawaban</label>
            <div className="mx-auto border">
              Essay
            </div>
          </div>
        )
      }
      <div className="border-2 border-gray-200 p-5">
        <label>Jawaban Benar</label>
        <p>pilihan {numberToUpperCase(props.question.answer)}</p>
        <label>Penjelasan Jawaban</label>
        <div className="mx-auto border">
          <QuestionEditor
            content={props.question.explanation?.content ?? null}
            exerciseQuestionId={props.question.exercise_question_id}
            disableEdit
          />
        </div>
      </div>
    </AdminShowLayout>
  );
}
