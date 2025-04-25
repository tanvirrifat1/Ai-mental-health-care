import { model, Schema } from 'mongoose';
import { IMoodTracker } from './moodTracker.interface';

const moodTrackerSchema = new Schema<IMoodTracker>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mood: {
      type: String,
      required: true,
      enum: ['great', 'good', 'okay', 'low', 'very_low'],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const MoodTracker = model<IMoodTracker>(
  'MoodTracker',
  moodTrackerSchema,
);
