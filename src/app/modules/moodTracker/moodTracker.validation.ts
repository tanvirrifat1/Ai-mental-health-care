import { z } from 'zod';

export const moodTrackerZodSchema = z.object({
  body: z.object({
    date: z
      .string()
      .or(z.date())
      .refine(val => !isNaN(new Date(val as string).getTime()), {
        message: 'Invalid date',
      }),
    mood: z.enum(['great', 'good', 'okay', 'low', 'very_low']),
  }),
});
