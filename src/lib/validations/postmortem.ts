import { z } from 'zod';

export const upsertPostMortemSchema = z.object({
  whatWorked: z.string().optional(),
  whatFailed: z.string().optional(),
  actionItems: z.string().optional(),
});
