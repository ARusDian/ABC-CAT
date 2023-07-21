import { QuestionModel } from '@/Models/Question';
import React, { Ref } from 'react';
import BankQuestionItemEditor from './BankQuestionItemEditor';
import { Editor } from '@tiptap/react';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';

export function BankQuestionItemShow(props: {
  question: BankQuestionItemModel;
  editorRef?: React.MutableRefObject<Editor | null>;
}) {
  switch (props.question.type) {
    case 'Pilihan':
      return (
        <BankQuestionItemEditor
          content={props.question.question.content}
          bankQuestionId={props.question.bank_question_id}
          disableEdit
        />
      );
    case 'Kecermatan':
      return <div className="flex flex-row">
        {
          // TODO: kasih view
          props.question.question.questions.map((it, index) => (
            <div key={index}>{it}</div>
          ))
        }
      </div>;
  }
  //
}
