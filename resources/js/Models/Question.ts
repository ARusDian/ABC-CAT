import { EditorValue } from "./EditorValue";

export interface BaseQuestionModel {
  id?: number;
  exercise_question_id?: string;
  weight: number;
  is_active: boolean;
}

export type QuestionModel = BaseQuestionModel &
  AnswerTypeModel & {
    id: number;
    exercise_question_id: string;
  };

export type QuestionFormModel = BaseQuestionModel & AnswerTypeModel;

export interface AnswerTypePilihanModel {
  type: 'Pilihan';
  question: EditorValue;
  answers: {
    choices: EditorValue[];
  };
  explanation: EditorValue;
  answer: number;
}

export interface AnswerTypeKecermatanModel {
  type: 'Kecermatan';
  question: {
    questions: string[];
  };
  answers: {
    choices: string[];
  };
  answer: number;
  explanation: undefined;
}

export type QuestionGenericModel<T> = BaseQuestionModel & T;

export type QuestionPilihanModel = QuestionGenericModel<AnswerTypePilihanModel>;
export type QuestionKecermatanModel =
  QuestionGenericModel<AnswerTypeKecermatanModel>;

export type AnswerTypeModel =
  | AnswerTypePilihanModel
  | AnswerTypeKecermatanModel;

export type QuestionFormGenericModel<T> = BaseQuestionModel & T;
export type QuestionPilihanFormModel =
  QuestionFormGenericModel<AnswerTypePilihanModel>;
export type QuestionKecermatanFormModel =
  QuestionFormGenericModel<AnswerTypeKecermatanModel>;
