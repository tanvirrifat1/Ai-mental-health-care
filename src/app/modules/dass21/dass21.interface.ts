import { Types } from 'mongoose';

export type IDass21 = {
  userId: Types.ObjectId;
  depressionLevel: string;
  depressionScore: number;
  anxietyLevel: string;
  anxietyScore: number;
  stressLevel: string;
  stressScore: number;
  suggestions: string;
  depression: string[];
  anxiety: string[];
  stress: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
