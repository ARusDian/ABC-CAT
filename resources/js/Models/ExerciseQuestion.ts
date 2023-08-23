import { LearningCategoryModel } from './LearningCategory';
import { BankQuestionItemModel } from './BankQuestionItem';
import { ExamModel } from './Exam';

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
  deleted_at?: string;
  exams?: ExamModel[];
  learning_category?: LearningCategoryModel;

  cluster_names: Record<number, string>;
}

export const EXERCISE_QUESTION_TYPE = ['Pilihan', 'Kecermatan'] as const;

export const DEFAULT_EXERCISE_QUESTION_TYPE = EXERCISE_QUESTION_TYPE[0];

export type ExerciseQuestionType = (typeof EXERCISE_QUESTION_TYPE)[number];
