import { QuestionModel } from './Question';

export interface ExerciseQuestionFormModel {
  name: string;
}

export interface ExerciseQuestionModel {
  id: string;
  name: string;

  questions?: QuestionModel;
}
