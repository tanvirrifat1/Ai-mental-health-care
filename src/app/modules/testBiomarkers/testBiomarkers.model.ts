import { model, Schema } from 'mongoose';
import { ITestBiomarkers } from './testBiomarkers.interface';

const testBiomarkersSchema = new Schema<ITestBiomarkers>(
  {
    biomarkerId: {
      type: Schema.Types.ObjectId,
      ref: 'Biomark',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    testDate: {
      type: Date,
      required: true,
    },
    testResult: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    testingReminder: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const TestBiomarkers = model<ITestBiomarkers>(
  'TestBiomarkers',
  testBiomarkersSchema,
);
