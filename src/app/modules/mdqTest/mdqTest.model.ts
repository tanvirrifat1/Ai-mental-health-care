import { model, Schema } from 'mongoose';
import { IMdqTest } from './mdqTest.interface';

const mdqTestSchema = new Schema<IMdqTest>(
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

export const MdqTest = model<IMdqTest>('mdqTest', mdqTestSchema);
