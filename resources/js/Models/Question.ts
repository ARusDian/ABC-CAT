export interface BaseQuestionModel {
  content: string;
  images: string[];
  weight: number;
  time_limit: number;
}

export interface QuestionModel extends BaseQuestionModel {
  id: number;
}

export interface QuestionFormModel
  extends BaseQuestionModel,
    AnswerTypeFormModel {}

export interface AnswerTypePilihanModel {
  type: 'pilihan';
  answers: {
    choices: string[];
    right_answer: number;
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
    right_answer: number;
  };
}

export type AnswerTypeFormModel = AnswerTypePilihanFormModel;
