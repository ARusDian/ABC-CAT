import { QuestionModel } from "./Question";

export interface ExamModel {
  id: string;
  exercise_question_id: string;
  expire_in: string;

  answers: ExamAnswerModel[];
}

export interface ExamAnswerModel {
  id: number;
  exam_id: number;
  answer: any;
  state: {
    mark: boolean;
  };

  question: QuestionModel;
}
