export interface BaseQuestionModel {
  id?: number;
  content: string;
  images?: string[];
  answer?: AnswerModel;
}

export interface QuestionModel extends BaseQuestionModel {
  id: number;
}

interface AnswerModel {
  id?: number;
}
