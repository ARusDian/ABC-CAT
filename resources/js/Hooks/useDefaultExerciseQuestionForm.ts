import {
  DEFAULT_EXERCISE_QUESTION_TYPE,
  ExerciseQuestionFormModel,
} from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';

export function useDefaultExerciseQuestionFormModel() {
  return useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: '',
      type: DEFAULT_EXERCISE_QUESTION_TYPE,
      time_limit: 120,
      number_of_question: 50,
    },
  });
}
