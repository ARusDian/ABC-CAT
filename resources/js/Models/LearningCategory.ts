import { BankQuestionModel } from './BankQuestion';
import { ExerciseQuestionModel } from './ExerciseQuestion';
import { LearningMaterialModel } from './LearningMaterial';
import { SubLearningPacketModel } from './SubLearningPacket';

export interface LearningCategoryFormModel {
    id?: number;
    name: string;
    sub_learning_packet_id: number;
}

export interface LearningCategoryModel extends LearningCategoryFormModel {
    id: number;
    name: string;
    sub_learning_packet_id: number;
    SubLearningPacket?: SubLearningPacketModel;
    bank_questions?: BankQuestionModel[];
    exercise_questions?: ExerciseQuestionModel[];
    learning_materials?: LearningMaterialModel[];
}
