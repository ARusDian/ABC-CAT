import { User } from '@/types';
import { ExerciseQuestionModel } from './ExerciseQuestion';
import { AnswerTypePilihanModel, QuestionGenericModel, QuestionKecermatanModel, QuestionModel, QuestionPilihanModel } from './Question';
import { BankQuestionItemKecermatanModel, BankQuestionItemModel, BankQuestionItemPilihanModel } from './BankQuestionItem';

export interface ExamModel {
  id: string;
  exercise_question_id: string;
  expire_in: string;
  finished: boolean;

  created_at: string;
  updated_at: string;
  finished_at: string;
  answers: ExamAnswerModel[];
  exercise_question: ExerciseQuestionModel;
  user: User;
}

export interface BaseExamAnswerModel {
  id: string;
  exam_id: string;
  answer: any;
  score: number;
  state: {
    mark: boolean;
  };

  // question: BankQuestionItemModel;
}

export type ExamAnswerGenericModel<QuestionModel> = BaseExamAnswerModel & { question: QuestionModel };

export type ExamAnswerModel = ExamAnswerGenericModel<BankQuestionItemModel>;
export type ExamAnswerPilihanModel = ExamAnswerGenericModel<BankQuestionItemPilihanModel>;
export type ExamAnswerKecermatanModel = ExamAnswerGenericModel<BankQuestionItemKecermatanModel>;

export interface ExamGenericModel<QuestionModel> {
  answers: (ExamAnswerGenericModel<QuestionModel>)[]

}

export interface ExamPilihanModel extends ExamGenericModel<QuestionPilihanModel> {
  //
}
