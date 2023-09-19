import {
  DEFAULT_EXERCISE_QUESTION_TYPE,
  ExerciseQuestionFormModel,
} from '@/Models/ExerciseQuestion';
import { useForm } from 'react-hook-form';

export function useDefaultExerciseQuestionFormModel(
  defaultValues?: Partial<ExerciseQuestionFormModel>,
) {
  const type = defaultValues?.type ?? DEFAULT_EXERCISE_QUESTION_TYPE;
  const time_limit = type == 'Pilihan' ? 120 : type == 'Kecermatan' ? 1 : 120;
  return useForm<ExerciseQuestionFormModel>({
    defaultValues: {
      name: defaultValues?.name ?? '',
      type,
      time_limit,
      number_of_question: defaultValues?.number_of_question ?? 50,
      options: {
        next_question_after_answer: false,
      },
    },
  });
}
