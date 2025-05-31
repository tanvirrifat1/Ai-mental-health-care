import { Types } from 'mongoose';

export type IGad7Test = {
  userId: Types.ObjectId;
  score: number;
  severityLevel: string;
  suggestions: string;
  type: string;
};
