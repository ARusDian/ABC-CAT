import { AnswerTypePilihanModel, QuestionGenericModel, QuestionModel, QuestionPilihanModel } from './Question';

export interface ExamModel {
  id: string;
  exercise_question_id: string;
  expire_in: string;

  answers: ExamAnswerModel[];
}

export interface ExamAnswerModel {
  id: string;
  exam_id: string;
  answer: any;
  state: {
    mark: boolean;
  };

  question: QuestionModel;
}

export type ExamAnswerGenericModel<QuestionModel> = ExamAnswerModel & { question: QuestionModel };

export type ExamAnswerPilihanModel = ExamAnswerGenericModel<QuestionPilihanModel>;

export interface ExamGenericModel<QuestionModel> {
  answers: (ExamAnswerGenericModel<QuestionModel>)[]

}

export interface ExamPilihanModel extends ExamGenericModel<QuestionPilihanModel> {
  //
}
