import { model, Schema } from 'mongoose';
import { IPsychologicalTest } from './psychologicalTest.interface';

const PsychologicalTestSchema = new Schema<IPsychologicalTest>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export const PsychologicalTest = model<IPsychologicalTest>(
  'PsychologicalTest',
  PsychologicalTestSchema,
);
