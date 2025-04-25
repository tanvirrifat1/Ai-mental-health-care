import { Types } from 'mongoose';

export type IMoodTracker = {
  user: Types.ObjectId;
  date: Date;
  mood: string;
};
