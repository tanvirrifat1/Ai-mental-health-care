import { Types } from 'mongoose';

export type IBiomark = {
  testName: string;
  description: string;
  userId: Types.ObjectId;
};
