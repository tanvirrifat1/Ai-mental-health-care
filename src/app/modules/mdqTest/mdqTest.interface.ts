import { Types } from 'mongoose';

export type IMdqTest = {
  userId: Types.ObjectId;
  score: number;
  severityLevel: string;
  suggestions: string;
  Types: string;
};
