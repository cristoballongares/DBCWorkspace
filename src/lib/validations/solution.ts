import { z } from 'zod';

export const createSolutionSchema = z.object({
  content: z.string().min(1),
  reasoning: z.string().optional(),
  timeSpentMin: z.number().int().positive().optional(),
  attemptCount: z.number().int().positive().default(1),
});

export const updateSolutionSchema = createSolutionSchema.partial();
