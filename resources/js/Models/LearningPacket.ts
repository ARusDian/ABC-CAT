import { User } from "@/types";
import { SubLearningPacketModel } from "./SubLearningPacket";
import { UserLearningPacketModel } from "./UserLearningPacket";

export interface LearningPacketFormModel {
    name: string;
    description: string;
}

export interface LearningPacketModel {
    id: number;
    name: string;
    description: string;
    sub_learning_packets: SubLearningPacketModel[];
    users?: User[];
    user_learning_packets?: UserLearningPacketModel[];
}
