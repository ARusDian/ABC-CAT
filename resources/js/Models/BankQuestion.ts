import { BankQuestionItemModel } from './BankQuestionItem';

export interface BankQuestionFormModel {
  name: string;
  type: BankQuestionType;
}

export interface BankQuestionModel {
  id: string;
  name: string;
  type: BankQuestionType;

  items?: BankQuestionItemModel[];
}

export const BANK_QUESTION_TYPE = ['Pilihan', 'Kecermatan'] as const;

export const DEFAULT_BANK_QUESTION_TYPE = BANK_QUESTION_TYPE[0];

export type BankQuestionType = (typeof BANK_QUESTION_TYPE)[number];
