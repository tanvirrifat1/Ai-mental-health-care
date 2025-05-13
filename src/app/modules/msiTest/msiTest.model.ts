import { model, Schema } from 'mongoose';
import { IMsiTest } from './msiTest.interface';

const msiTestSchema = new Schema<IMsiTest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    severityLevel: {
      type: String,
      enum: ['Normal', 'Mild', 'Moderate', 'Severe'],
    },
    suggestions: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const MsiBpdTest = model<IMsiTest>('msiBpdTest', msiTestSchema);
