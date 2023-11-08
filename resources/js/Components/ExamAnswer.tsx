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

function useRandomizedChoice<T>(
  choices: T[],
  choice_order?: Partial<{ choices: Record<number, number> }> | null,
) {
  return React.useMemo(() => {
    return _.sortBy(
      choices.map((value, answer) => ({
        answer,
        value,
        order: choice_order?.choices?.[answer] ?? answer,
      })),
      'order',
    );
  }, [choices, choice_order]);
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
  const choices = useRandomizedChoice(
    answer.question.answers.choices,
    answer.choice_order,
  );
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

      if (Object.keys(choice.value.content).length != 0) {
        editorRef?.current?.commands.setContent(choice.value.content);
      } else {
        editorRef?.current?.commands.clearContent();
      }
    });
  }, [answer.id]);

  return (
    <div className="flex flex-col gap-1">
      {choices.map((choice, enumerate) => {
        const editorRef = arrayEditorRef.current[enumerate];

        const answerQuestion = answer.question.answer;
        let isCorrect = false;

        if (isEvaluation) {
          if (answerQuestion?.type == 'Single') {
            isCorrect = answerQuestion.answer == choice.answer;
          } else if (answerQuestion?.type == 'WeightedChoice') {
            isCorrect = answerQuestion.answer[choice.answer].weight > 0;
          }
        }
        return (
          <div
            className={`flex justify-between rounded-lg px-3 ${
              isEvaluation
                ? parseInt(answer.answer) === choice.answer
                  ? isCorrect
                    ? 'bg-green-50'
                    : 'bg-red-50'
                  : isCorrect
                  ? 'bg-green-50'
                  : ''
                : ''
            }`}
            key={enumerate}
          >
            <div className="flex gap-3">
              <input
                type="radio"
                className="my-auto"
                name={`answer-${answer.id}`}
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: choice.answer,
                  });
                }}
                checked={answer.answer == choice.answer}
              />
              {isEvaluation && answerQuestion?.type == 'WeightedChoice' ? (
                <div>{answerQuestion.answer[choice.answer].weight}</div>
              ) : null}
              <div className="py-2">
                <ResourceEditor
                  editorRef={editorRef}
                  content={choice.value.content}
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
  const choices = useRandomizedChoice(
    answer.question.answers.choices,
    answer.choice_order,
  );

  // store editor ref to prevent re-creating editor
  const arrayEditorRef = React.useRef<React.MutableRefObject<HTMLDivElement | null>[]>(
    [],
  );

  while (arrayEditorRef.current.length < choices.length) {
    arrayEditorRef.current.push({ current: null });
  }

  return (
    <div className="flex flex-col gap-3">
      {choices.map((choice, index) => {
        const currentEditorRef = arrayEditorRef.current[index]
        return (
          <div className="flex justify-between text-3xl" key={index} ref={currentEditorRef}>
            <div className="flex gap-3">
              <input
                type="radio"
                name="answer"
                disabled={updateAnswer == null}
                onChange={() => {
                  updateAnswer?.({
                    answer: choice.answer,
                  });
                }}
                checked={answer.answer == choice.answer}
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
