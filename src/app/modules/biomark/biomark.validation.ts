import { z } from 'zod';

export const biomarkSchema = z.object({
  testName: z.string({
    required_error: 'Test name is required',
  }),
});
