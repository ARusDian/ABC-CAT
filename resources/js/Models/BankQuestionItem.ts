import { EditorValue } from './EditorValue';

export interface BaseBankQuestionItemModel {
  id?: number;
  bank_question_id?: string;
  name: string;
  is_active: boolean;
}

export type BankQuestionItemModel = BaseBankQuestionItemModel &
  AnswerTypeModel & {
    id: number;
    bank_question_id: string;
  };

export type BankQuestionItemFormModel = BaseBankQuestionItemModel &
  AnswerTypeModel;

export interface AnswerTypePilihanModel {
  type: 'Pilihan';
  question: EditorValue;
  answers: {
    choices: EditorValue[];
  };
  explanation: EditorValue;
  answer: AnswerVariant<number>;
}

export interface AnswerTypeKecermatanModel {
  type: 'Kecermatan';
  question: {
    questions: string[];
  };
  answers: {
    choices: string[];
  };
  answer: AnswerVariant<number>;
  explanation: undefined;
}

export type AnswerVariant<T> =
  | {
      type: 'Single';
      answer: T;
    }
  | AnswerWeightedChoiceVariant;

export type AnswerWeightedChoiceVariant = {
  type: 'WeightedChoice';
  answer: {
    weight: number;
  }[];
};

export type BankQuestionItemGenericModel<T> = BaseBankQuestionItemModel & T;

export type BankQuestionItemPilihanModel =
  BankQuestionItemGenericModel<AnswerTypePilihanModel>;
export type BankQuestionItemKecermatanModel =
  BankQuestionItemGenericModel<AnswerTypeKecermatanModel>;

export type AnswerTypeModel =
  | AnswerTypePilihanModel
  | AnswerTypeKecermatanModel;

export type BankQuestionItemFormGenericModel<T> = BaseBankQuestionItemModel & T;
export type BankQuestionItemPilihanFormModel =
  BankQuestionItemFormGenericModel<AnswerTypePilihanModel>;
export type BankQuestionItemKecermatanFormModel =
  BankQuestionItemFormGenericModel<AnswerTypeKecermatanModel>;
