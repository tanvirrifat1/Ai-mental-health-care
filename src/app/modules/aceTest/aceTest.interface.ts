import { Types } from 'mongoose';

export type IAceTest = {
  userId: Types.ObjectId;
  score: number;
  severityLevel: string;
  suggestions: string;
};
