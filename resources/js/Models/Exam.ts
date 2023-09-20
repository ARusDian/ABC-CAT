import { User } from '@/types';
import { ExerciseQuestionModel } from './ExerciseQuestion';
import {
  AnswerTypePilihanModel,
  QuestionGenericModel,
  QuestionKecermatanModel,
  QuestionModel,
  QuestionPilihanModel,
} from './Question';
import {
  BankQuestionItemKecermatanModel,
  BankQuestionItemModel,
  BankQuestionItemPilihanModel,
} from './BankQuestionItem';
import _ from 'lodash';
import { formatTimestampMs } from '@/Utils/formatTimestampMs';

export interface ExamModel {
  id: string;
  exercise_question_id: string;
  user_id: string;
  expire_in: string;
  finished: boolean;

  created_at: string;
  updated_at: string;
  finished_at: string;
  answers: ExamAnswerModel[];
  exercise_question: ExerciseQuestionModel;
  user: User;

  answers_sum_score: number;
  answers_count: number;

  server_state: {
    current_question: number;
    current_exam_answer_id: number;
    current_cluster: number;
    timestamp_delay: number;
  };
  options: {
    exercise_question: {
      time_limit_per_cluster: number;
      next_question_after_answer: boolean;
    };
  };
  counter: Record<number, number>;

  result: Record<number, ExamAttributeResult>;

  cluster: Record<
    number,
    {
      counter: number;
      name: string;
    }
  >;
}

interface ExamAttributeResult {
  count: number;
  correct: number;
  answered: number;
  incorrect: number;
  score: number;
}

export interface BaseExamAnswerModel {
  id: string;
  exam_id: string;
  answer: any;
  score: number;
  cluster: number;
  bank_question_item_id: string;
  state: {
    mark: boolean;
  };

  choice_order: {
    choices: Record<number, number>;
  };
}

export type ExamAnswerGenericModel<QuestionModel> = BaseExamAnswerModel & {
  question: QuestionModel;
};

export type ExamAnswerModel = ExamAnswerGenericModel<BankQuestionItemModel>;
export type ExamAnswerPilihanModel =
  ExamAnswerGenericModel<BankQuestionItemPilihanModel>;
export type ExamAnswerKecermatanModel =
  ExamAnswerGenericModel<BankQuestionItemKecermatanModel>;

export interface ExamGenericModel<QuestionModel> {
  answers: ExamAnswerGenericModel<QuestionModel>[];
}

export interface ExamPilihanModel
  extends ExamGenericModel<QuestionPilihanModel> {
  //
}

export interface ExamResult {
  aspect: string;
  count: number;
  answered: number;
  time: number;
  time_formatted: string;

  correct: number;
  incorrect: number;
  score: number;
}

export function examAttributeResultToExamResult(
  exam: ExamModel,
  value: ExamAttributeResult,
  key: number,
): ExamResult {
  console.log(exam, key);
  return {
    aspect: exam.cluster[key].name,
    count: value.count,
    correct: value.correct,
    incorrect: value.incorrect,
    score: value.score,
    answered: value.answered,
    time: exam.cluster[key].counter,
    time_formatted: formatTimestampMs(exam.cluster[key].counter),
  };
}
export function examToResult(exam: ExamModel): ExamResult[] {
  return _.map(exam.result, (value: ExamAttributeResult, key: number) =>
    examAttributeResultToExamResult(exam, value, key),
  ) as any;
}

export function resultToTotal(results: ExamResult[]): ExamResult {
  const totalResult = results.reduce(
    (prev: ExamResult, item: ExamResult) => {
      return {
        answered: prev.answered + item.answered,
        count: prev.count + item.count,
        correct: prev.correct + item.correct,
        incorrect: prev.incorrect + item.incorrect,
        score: prev.score + item.score,
        time: prev.time + item.time,
        aspect: '',
        time_formatted: '',
      };
    },
    {
      aspect: '',
      count: 0,
      answered: 0,
      time: 0,
      time_formatted: '',
      correct: 0,
      incorrect: 0,
      score: 0,
    },
  );

  return {
    ...totalResult,
    time_formatted: formatTimestampMs(totalResult.time),
  };
}
