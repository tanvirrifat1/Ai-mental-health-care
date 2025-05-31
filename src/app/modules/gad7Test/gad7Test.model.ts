import { model, Schema } from 'mongoose';
import { IGad7Test } from './gad7Test.interface';

const gad7TestSchema = new Schema<IGad7Test>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 21,
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
      default: 'gad7',
    },
  },
  {
    timestamps: true,
  },
);

export const Gad7Test = model<IGad7Test>('Gad7Test', gad7TestSchema);
