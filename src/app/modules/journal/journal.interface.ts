import { Types } from 'mongoose';

export type IJournal = {
  title?: string;
  description: string;
  userId: Types.ObjectId;
  date: Date;
  type: 'Therapy Journal' | 'Daily Journal';
};
