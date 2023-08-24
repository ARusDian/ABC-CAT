import { ExamAnswerModel } from '@/Models/Exam';
import Button from '@mui/material/Button';
import React from 'react';

interface Props {
  setCurrentQuestion: (index: number) => void;
  getState?: (
    it: ExamAnswerModel,
    index: number,
  ) =>
    | {
        isRight?: boolean;
        hide?: boolean;
      }
    | undefined;
  answers: ExamAnswerModel[];
  currentQuestion: number;

  title?: string;
  nextTitle?: string;
  prevTitle?: string;
  isEvaluation?: boolean;
}

export function ExamNavigation(props: Props) {
  const {
    answers,
    currentQuestion,
    setCurrentQuestion,
    getState,
    title,
    nextTitle,
    prevTitle,
    isEvaluation,
  } = props;
  const isLastQuestion = currentQuestion === answers.length - 1;
  const prevState =
    answers[currentQuestion - 1] != null
      ? getState?.(answers[currentQuestion - 1], currentQuestion - 1)
      : null;
  const nextState =
    answers[currentQuestion + 1] != null
      ? getState?.(answers[currentQuestion + 1], currentQuestion + 1)
      : null;
  return (
    <div className="flex flex-col p-3 basis-1/3">
      <p className="font-bold text-lg">{title ?? 'Navigasi Soal'}</p>
      <div className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
        {answers.map((it, index) => {
          const state = getState?.(it, index);
          return (
            <Button
              className="text-center border-2  rounded-md p-2"
              variant="contained"
              color={
                it.state?.mark
                  ? 'warning'
                  : currentQuestion === index
                  ? 'primary'
                  : isEvaluation
                  ? it.question.answer.type === 'WeightedChoice'
                    ? it.answer != undefined
                      ? 'success'
                      : 'inherit'
                    : state?.isRight == true
                    ? 'success'
                    : state?.isRight == false
                    ? 'error'
                    : it.answer != undefined
                    ? 'info'
                    : 'inherit'
                  : state?.isRight == true
                  ? 'success'
                  : state?.isRight == false
                  ? 'error'
                  : it.answer != undefined
                  ? 'info'
                  : 'inherit'
              }
              onClick={() => {
                if (state?.hide) {
                  return;
                }
                setCurrentQuestion(index);
              }}
              key={index}
              disabled={state?.hide}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
      <div className="flex justify-between gap-3">
        <Button
          variant="contained"
          color="primary"
          className="w-1/2"
          onClick={() => {
            setCurrentQuestion(currentQuestion - 1);
          }}
          disabled={currentQuestion === 0 || prevState?.hide}
        >
          {prevTitle ?? 'Sebelumnya'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="w-1/2"
          onClick={() => {
            setCurrentQuestion(currentQuestion + 1);
          }}
          disabled={isLastQuestion || nextState?.hide}
        >
          {nextTitle ?? 'Selanjutnya'}
        </Button>
      </div>
    </div>
  );
}
