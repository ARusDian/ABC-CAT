import { LearningCategoryModel } from "./LearningCategory";
import { LearningPacketModel } from "./LearningPacket";

export interface SubLearningPacketFormModel {
    name: string;
    learning_packet_id: number;
}

export interface SubLearningPacketModel {
    id: number;
    name: string;
    learning_packet_id: number;
    learning_packet?: LearningPacketModel
    learning_categories?: LearningCategoryModel[];
}
