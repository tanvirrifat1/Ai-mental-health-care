import { Types } from 'mongoose';

export type IBiomark = {
  testName: string;
  userId: Types.ObjectId;
  upload: boolean;
  isTest: boolean;
  isSend: boolean;
};
