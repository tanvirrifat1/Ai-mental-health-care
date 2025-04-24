import { model, Schema } from 'mongoose';
import { IPsychologicalTest } from './psychologicalName.interface';

const PsychologicalNameSchema = new Schema<IPsychologicalTest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const PsychologicalTest = model<IPsychologicalTest>(
  'PsychologicalName',
  PsychologicalNameSchema,
);
