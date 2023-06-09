export type EditorValue = {
  type: 'tiptap';
  content: object;
};

export interface BaseQuestionModel {
  question: EditorValue;
  weight: number;
  answer?: any;
  explanation: EditorValue;
  is_active: boolean;
}

export interface QuestionModel extends BaseQuestionModel, AnswerTypeModel {
  id: number;
  exercise_question_id: string;
}

export interface QuestionFormModel extends QuestionModel {}

export interface AnswerTypePilihanModel {
  type: 'Pilihan';
  answers: {
    choices: EditorValue[];
  };
}

export type AnswerTypeModel = AnswerTypePilihanModel;
//
// export interface AnswerTypePilihanFormModel {
//   type: 'pilihan';
//   answers: {
//     choices: {
//       images: string[];
//       content: string;
//     }[];
//   };
// }

// export type AnswerTypeFormModel = AnswerTypePilihanFormModel;
