import React from 'react';
import { Editor } from '@tiptap/react';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import ResourceEditor from './ResourceEditor';
import { numberToLowerCase } from '@/Utils/Convert';

export function BankQuestionItemShow(props: {
  question: BankQuestionItemModel;
  editorRef?: React.MutableRefObject<Editor | null>;
  editorClassName?: string;
}) {
  switch (props.question.type) {
    case 'Pilihan':
      return (
        <div className="prose">
          <ResourceEditor
            editorClassName={props.editorClassName}
            content={props.question.question.content}
            editorRef={props.editorRef}
            disableEdit
          />
        </div>
      );
    case 'Kecermatan':
      return (
        <div className="flex flex-col gap-3">
          <div className="text-4xl mb-3 font-bold">
            <table>
              <tbody>
                <tr>
                  {props.question.answers.choices.map((it, index) => (
                    <td
                      key={index}
                      className="border-4 border-black text-center py-3 px-5"
                    >
                      {numberToLowerCase(index)}
                    </td>
                  ))}
                </tr>
                <tr>
                  {props.question.answers.choices.map((it, index) => (
                    <td
                      key={index}
                      className="border-4 border-black text-center py-3 px-5"
                    >
                      {it}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-row text-5xl gap-7 mb-3 font-bold">
            {props.question.question.questions.map((it, index) => (
              <div key={index}>{it}</div>
            ))}
          </div>
        </div>
      );
  }
  //
}
