import { LearningCategoryModel } from './LearningCategory';
import { BankQuestionItemModel } from './BankQuestionItem';
import { ExamModel } from './Exam';

export interface ExerciseQuestionFormModel {
  name: string;
  type: ExerciseQuestionType;
  time_limit: number;
  number_of_question: number;
  is_next_question_after_answered: boolean;
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
  learning_category_id: string;

  cluster_names: Record<number, string>;
  options: {
    cluster_by_bank_question: boolean;
    cluster_name_prefix: string | null;
    next_question_after_answer : boolean;
    number_of_question_per_cluster: number | false;
    randomize_choices: boolean;
    time_limit_per_cluster: number | false;
  }
}

export const EXERCISE_QUESTION_TYPE = ['Pilihan', 'Kecermatan'] as const;

export const DEFAULT_EXERCISE_QUESTION_TYPE = EXERCISE_QUESTION_TYPE[0];

export type ExerciseQuestionType = (typeof EXERCISE_QUESTION_TYPE)[number];
