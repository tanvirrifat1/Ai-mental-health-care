import { model, Schema } from 'mongoose';
import { IDass21 } from './dass21.interface';

const suggestionSchema = new Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 21,
    },
    severityLevel: {
      type: String,
      enum: ['Normal', 'Mild', 'Moderate', 'Severe', 'Extremely Severe'],
      required: true,
    },
    suggestions: {
      type: String,
      required: false,
    },
  },
  { _id: false }, // prevent creating _id for nested objects
);

const dass21Schema = new Schema<IDass21>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    depression: suggestionSchema,
    anxiety: suggestionSchema,
    stress: suggestionSchema,
  },
  {
    timestamps: true,
  },
);

export const Dass21 = model<IDass21>('Dass21', dass21Schema);
