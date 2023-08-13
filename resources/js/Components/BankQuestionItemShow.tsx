import { QuestionModel } from '@/Models/Question';
import React, { Ref } from 'react';
import BankQuestionItemEditor from './BankQuestionItemEditor';
import { Editor } from '@tiptap/react';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import ResourceEditor from './ResourceEditor';

export function BankQuestionItemShow(props: {
  question: BankQuestionItemModel;
  editorRef?: React.MutableRefObject<Editor | null>;
  editorClassName?: string;
}) {
  switch (props.question.type) {
    case 'Pilihan':
      return (
        <ResourceEditor
          editorClassName={props.editorClassName}
          content={props.question.question.content}
          editorRef={props.editorRef}
          disableEdit
        />
      );
    case 'Kecermatan':
      return (
        <div className="flex flex-row text-2xl gap-5 mb-3 font-semibold">
          {props.question.question.questions.map((it, index) => (
            <div key={index}>{it}</div>
          ))}
        </div>
      );
  }
  //
}
