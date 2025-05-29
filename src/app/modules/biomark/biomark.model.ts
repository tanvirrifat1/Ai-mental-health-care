import { model, Schema } from 'mongoose';
import { IBiomark } from './biomark.interface';

const biomarkSchema = new Schema<IBiomark>(
  {
    testName: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    upload: { type: Boolean, default: false },
    isTest: { type: Boolean },
  },
  { timestamps: true },
);

export const Biomark = model<IBiomark>('Biomark', biomarkSchema);
