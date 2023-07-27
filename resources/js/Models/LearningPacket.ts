import { SubLearningPacketModel } from "./SubLearningPacket";

export interface LearningPacketFormModel {
    name: string;
    description: string;
}

export interface LearningPacketModel {
    id: number;
    name: string;
    description: string;
    sub_learning_packets: SubLearningPacketModel[];
}
