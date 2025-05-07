import { Types } from 'mongoose';

export type ITestBiomarkers = {
  testDate: Date;
  testResult: string;
  state: 'High' | 'Low' | 'Normal';
  userId: Types.ObjectId;
  testingReminder: Date;
  comment: string;
  biomarkerId: Types.ObjectId;
};
