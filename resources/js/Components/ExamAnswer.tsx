import BankQuestionItemEditor from '@/Components/BankQuestionItemEditor';
import { BankQuestionItemShow } from '@/Components/BankQuestionItemShow';
import ResourceEditor from '@/Components/ResourceEditor';
import { BankQuestionItemModel } from '@/Models/BankQuestionItem';
import {
  ExamAnswerKecermatanModel,
  ExamAnswerModel,
  ExamAnswerPilihanModel,
} from '@/Models/Exam';
import Typography from '@mui/material/Typography';
import { Editor } from '@tiptap/react';
import _ from 'lodash';
import React, { MutableRefObject } from 'react';

interface Props {
  answer: ExamAnswerModel;
  updateAnswer?: (answer: { answer: any }) => void;
  isEvaluation?: boolean;
}

export default function ExamAnswer({
  answer,
  updateAnswer,
  isEvaluation = false,
}: Props) {
  const questionEditorRef = React.useRef<Editor | null>(null);
  const explanationEditorRef = React.useRef<Editor | null>(null);

  React.useEffect(() => {
    switch (answer.question.type) {
      case 'Pilihan':
        questionEditorRef?.current?.commands?.setContent(
          answer.question.question.content,
        );
        explanationEditorRef?.current?.commands?.setContent(
          answer.question.explanation.content,
        );
        break;
    }
  });

  return (
    <div className="px-3 flex flex-col gap-3">
      <div>
        <BankQuestionItemShow
          question={answer.question}
          editorRef={questionEditorRef}
          editorClassName=""
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
      {isEvaluation && answer.question.type == 'Pilihan' ? (
        <div className="bg-yellow-100 rounded-md p-3">
          <div className="text-lg font-bold">Pembahasan :</div>
          <div className="text-lg">
            <ResourceEditor
              content={answer.question.explanation?.content ?? null}
              editorRef={explanationEditorRef}
              editorClassName=""
              disableEdit
            />
          </div>
        </div>
      ) : null}
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

      if (Object.keys(choice.content).length != 0) {
        editorRef?.current?.commands.setContent(choice.content);
      } else {
        editorRef?.current?.commands.clearContent();
      }
    });
  }, [answer.id]);

  return (
    <div className="flex flex-col gap-1">
      {choices.map((choice, index) => {
        const editorRef = arrayEditorRef.current[index];

        const answerQuestion = answer.question.answer;
        let isCorrect = false;

        if (isEvaluation) {
          if (answerQuestion?.type == 'Single') {
            isCorrect = answerQuestion.answer == index;
          } else if (answerQuestion?.type == 'WeightedChoice') {
            isCorrect = answerQuestion.answer[index].weight > 0;
          }
        }
        return (
          <div
            className={`flex justify-between rounded-lg px-3 ${
              isEvaluation
                ? parseInt(answer.answer) === index
                  ? isCorrect
                    ? 'bg-green-50'
                    : 'bg-red-50'
                  : isCorrect
                  ? 'bg-green-50'
                  : ''
                : ''
            }`}
            key={index}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                className="my-auto"
                name={`answer-${answer.id}`}
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: index,
                  });
                }}
                checked={answer.answer == index}
              />
              {isEvaluation && answerQuestion?.type == 'WeightedChoice' ? (
                <div>{answerQuestion.answer[index].weight}</div>
              ) : null}
              <div className="prose">
                <ResourceEditor
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
  const choices = React.useMemo(() => {
    return _.sortBy(
      answer.question.answers.choices.map((value, index) => ({
        index,
        value,
        order: answer.choice_order?.choices?.[index] ?? index,
      })),
      'order',
    );
  }, [answer.choice_order]);

  // store editor ref to prevent re-creating editor
  const arrayEditorRef = React.useRef<React.MutableRefObject<Editor | null>[]>(
    [],
  );

  while (arrayEditorRef.current.length < choices.length) {
    arrayEditorRef.current.push({ current: null });
  }

  return (
    <div className="flex flex-col gap-3">
      {choices.map((choice, index) => {
        return (
          <div className="flex justify-between text-3xl" key={index}>
            <div className="flex gap-3">
              <input
                type="radio"
                name="answer"
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: choice.index,
                  });
                }}
                checked={answer.answer == choice.index}
              />
              <div className=" mx-auto ">
                <p>{choice.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
