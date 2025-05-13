import { Types } from 'mongoose';

export type IBprs = {
  userId: Types.ObjectId;
  score: number;
  severityLevel: string;
  suggestions: string;
};
