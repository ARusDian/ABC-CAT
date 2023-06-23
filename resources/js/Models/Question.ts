export interface BaseQuestionModel {
  content: string;
  images: string[];
  weight: number;
  time_limit: number;
  answer?: any;
}

export interface QuestionModel extends BaseQuestionModel, AnswerTypeModel {
  id: number;
  exercise_question_id: number;
}

export interface QuestionFormModel
  extends BaseQuestionModel,
    AnswerTypeFormModel {}

export interface AnswerTypePilihanModel {
  type: 'pilihan';
  answers: {
    choices: string[];
  };
}

export type AnswerTypeModel = AnswerTypePilihanModel;

export interface AnswerTypePilihanFormModel {
  type: 'pilihan';
  answers: {
    choices: {
      images: string[];
      content: string;
    }[];
  };
}

export type AnswerTypeFormModel = AnswerTypePilihanFormModel;
