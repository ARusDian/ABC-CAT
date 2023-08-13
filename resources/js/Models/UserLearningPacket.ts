import { User } from '@/types';
import { LearningPacketModel } from './LearningPacket';

export interface UserLearningPacketModel {
  id: number;
  user_id: number;
  learning_packet_id: number;
  user: User;
  learning_packet: LearningPacketModel;
  created_at: string;
}

export interface UserLearningPacketFormModel {
  user: User;
  learning_packet: LearningPacketModel;
}
