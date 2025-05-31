import { Types } from 'mongoose';

export type IMsiTest = {
  userId: Types.ObjectId;
  score: number;
  severityLevel: string;
  suggestions: string;
  type: string;
};
