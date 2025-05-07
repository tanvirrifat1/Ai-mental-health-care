import { z } from 'zod';

export const journalZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string({
      required_error: 'Description is required',
    }),
    type: z.enum(['Therapy Journal', 'Daily Journal'], {
      required_error: 'Type is required',
    }),
  }),
});
