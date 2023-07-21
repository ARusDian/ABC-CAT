import { BankQuestionItemModel } from './BankQuestionItem';

export interface ExerciseQuestionFormModel {
  name: string;
  type: ExerciseQuestionType;
  time_limit: number;
  number_of_question: number;
}

export interface ExerciseQuestionModel {
  id: string;
  name: string;
  time_limit: number;
  number_of_question: number;

  questions?: BankQuestionItemModel[];

  type: ExerciseQuestionType;
}

export const EXERCISE_QUESTION_TYPE = ['Pilihan', 'Kecermatan'] as const;

export const DEFAULT_EXERCISE_QUESTION_TYPE = EXERCISE_QUESTION_TYPE[0];

export type ExerciseQuestionType = typeof EXERCISE_QUESTION_TYPE[number];
