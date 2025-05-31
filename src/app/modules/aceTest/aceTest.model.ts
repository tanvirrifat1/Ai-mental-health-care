import { model, Schema } from 'mongoose';
import { IAceTest } from './aceTest.interface';

const aceTestSchema = new Schema<IAceTest>(
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
    type: {
      type: String,
      default: 'ace',
    },
  },
  {
    timestamps: true,
  },
);

export const AceTest = model<IAceTest>('aceTest', aceTestSchema);
