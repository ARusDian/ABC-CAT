import { User } from '@/types';
import { SubLearningPacketModel } from './SubLearningPacket';
import { UserLearningPacketModel } from './UserLearningPacket';
import { BaseDocumentFileModel } from './FileModel';

export interface LearningPacketFormModel {
  name: string;
  description: string;
  photo?: BaseDocumentFileModel;
  photo_path: string;
}

export interface LearningPacketModel {
  id: number;
  name: string;
  description: string;
  photo_path: string;
  sub_learning_packets: SubLearningPacketModel[];
  users?: User[];
  user_learning_packets?: UserLearningPacketModel[];
  deleted_at?: string;
}
