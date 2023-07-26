import { QuestionModel } from '@/Models/Question';
import React from 'react';
import QuestionEditor from './QuestionEditor';
import { Editor } from '@tiptap/react';

export function QuestionShow(props: {
  question: QuestionModel;
  editorRef?: React.MutableRefObject<Editor | null>;
}) {
  switch (props.question.type) {
    case 'Pilihan':
      return (
        <QuestionEditor
          content={props.question.question.content}
          exerciseQuestionId={props.question.exercise_question_id}
          editorClassName="h-full"
          disableEdit
        />
      );
    case 'Kecermatan':
      return (
        <div className="flex flex-row">
          {
            // TODO: kasih view
            props.question.question.questions.map((it, index) => (
              <div key={index}>{it}</div>
            ))
          }
        </div>
      );
  }
  //
}
