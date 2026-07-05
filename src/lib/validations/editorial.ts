import { z } from 'zod';

export const upsertEditorialSchema = z.object({
  content: z.string().min(1),
});
