import { model, Schema } from 'mongoose';
import { IJournal } from './journal.interface';

const journalSchema = new Schema<IJournal>(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['Therapy Journal', 'Daily Journal'],
      trim: true,
    },
    heading: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Journal = model<IJournal>('Journal', journalSchema);
