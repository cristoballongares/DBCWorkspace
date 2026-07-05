import { z } from 'zod';

export const createTopicSchema = z.object({
  title: z.string().min(1),
  category: z.string().min(1),
  content: z.string().min(1),
  commonPitfalls: z.string().optional(),
  problemIds: z.array(z.string()).default([]),
  parentId: z.string().optional(),
  order: z.number().int().default(0),
});

export const updateTopicSchema = createTopicSchema.partial();
