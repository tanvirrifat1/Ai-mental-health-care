import { model, Schema } from 'mongoose';
import { IBprs } from './bprs.interface';

const bprschema = new Schema<IBprs>(
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
      default: 'bprs',
    },
  },
  {
    timestamps: true,
  },
);

export const Bprs = model<IBprs>('Bprs', bprschema);
