import BankQuestionItemEditor from '@/Components/BankQuestionItemEditor';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import {
  ExamAnswerKecermatanModel,
  ExamAnswerModel,
  ExamAnswerPilihanModel,
} from '@/Models/Exam';
import Typography from '@mui/material/Typography';
import { Editor } from '@tiptap/react';
import React, { MutableRefObject } from 'react';

interface Props {
  answer: ExamAnswerModel;
  questionEditorRef?: MutableRefObject<Editor | null>;
  updateAnswer?: (answer: { answer: any }) => void;
  isEvaluation?: boolean;
}

export default function Answer({
  answer,
  questionEditorRef,
  updateAnswer,
  isEvaluation = false,
}: Props) {

  return (
    <div className='border-b'>
      <div className="prose">
        <BankQuestionItemShow
          question={answer.question}
          editorRef={questionEditorRef}
          editorClassName=''
        />
      </div>

      <div className="flex flex-col gap-3">
        {answer.question.type == 'Pilihan' ? (
          <PilihanAnswerForm
            answer={answer as ExamAnswerPilihanModel}
            updateAnswer={updateAnswer}
            isEvaluation={isEvaluation}
          />
        ) : answer.question.type == 'Kecermatan' ? (
          <KecermatanAnswerForm
            answer={answer as ExamAnswerKecermatanModel}
            updateAnswer={updateAnswer}
          />
        ) : null}
      </div>
    </div>
  );
}

function PilihanAnswerForm({
  answer,
  isEvaluation = false,
  updateAnswer,
}: {
  // answerArray: UseFieldArrayReturn<ExamModel, 'answers', 'idHash'>;
  answer: ExamAnswerPilihanModel;
  isEvaluation?: boolean;
  updateAnswer?: (answer: { answer: number }) => void;
}) {
  let choices = answer.question.answers.choices;
  // store editor ref to prevent re-creating editor
  const arrayEditorRef = React.useRef<React.MutableRefObject<Editor | null>[]>(
    [],
  );

  while (arrayEditorRef.current.length < choices.length) {
    arrayEditorRef.current.push({ current: null });
  }
  React.useEffect(() => {
    choices.map((choice, index) => {
      const editorRef = arrayEditorRef.current[index];

      editorRef?.current?.commands.setContent(choice.content);
    });
  }, [answer.id]);

  return (
    <div>
      {choices.map((choice, index) => {
        const editorRef = arrayEditorRef.current[index];
        const isCorrect = answer.question.answer == index;
        return (
          <div className={`flex justify-between rounded ${isEvaluation ? (
            parseInt(answer.answer) === index ? (
              isCorrect ? "bg-green-200" : "bg-red-200"
            ) : isCorrect ? "bg-green-200" : ""
          ) : ""}`}
            key={index}>
            <div className="flex gap-1 my-auto">
              <input
                type="radio"
                className='my-auto'
                name={`answer-${answer.id}`}
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: index,
                  });
                }}
                checked={answer.answer == index}
              />
              <div className="prose">
                <BankQuestionItemEditor
                  editorRef={editorRef}
                  content={choice.content}
                  editorClassName=""
                  disableEdit
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KecermatanAnswerForm({
  answer,
  updateAnswer,
}: {
  answer: ExamAnswerKecermatanModel;
  updateAnswer?: (answer: { answer: number }) => void;
}) {
  const choices = answer.question.answers.choices;

  // store editor ref to prevent re-creating editor
  const arrayEditorRef = React.useRef<React.MutableRefObject<Editor | null>[]>(
    [],
  );

  while (arrayEditorRef.current.length < choices.length) {
    arrayEditorRef.current.push({ current: null });
  }

  return (
    <div>
      {choices.map((choice, index) => {
        console.log(answer.answer, updateAnswer == null);
        return (
          <div className="flex justify-between" key={index}>
            <div className="flex gap-3">
              <input
                type="radio"
                name="answer"
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: index,
                  });
                }}
                checked={answer.answer == index}
              />
              <div className="prose mx-auto">
                <Typography>{choice}</Typography>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
