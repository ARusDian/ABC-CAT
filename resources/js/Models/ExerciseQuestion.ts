import { QuestionModel } from './Question';

export interface ExerciseQuestionFormModel {
  name: string;
  time_limit: number;
  number_of_question: number;
}

export interface ExerciseQuestionModel {
  id: string;
  name: string;
  time_limit: number;
  number_of_question: number;

  questions?: QuestionModel[];
}
