import { QuestionModel } from './Question';

export interface ExerciseQuestionFormModel {
  name: string;
  time_limit: number;
}

export interface ExerciseQuestionModel {
  id: string;
  name: string;
  time_limit: number;

  questions?: QuestionModel[];
}
