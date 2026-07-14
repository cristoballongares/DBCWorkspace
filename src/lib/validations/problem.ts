import { z } from 'zod';

const difficultyEnum = z.enum(['EASY', 'MEDIUM', 'HARD', 'UNRATED']);
const statusEnum = z.enum(['UNSOLVED', 'SOLVED_INDIVIDUAL', 'SOLVED_TEAM']);

export const createProblemSchema = z.object({
  title: z.string().min(1),
  source: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  difficulty: difficultyEnum.default('UNRATED'),
  status: statusEnum.default('UNSOLVED'),
  statementNotes: z.string().optional(),
  tagNames: z.array(z.string().min(1)).default([]),
});

export const updateProblemSchema = createProblemSchema.partial();

export const randomBatchSchema = z.object({
  buckets: z
    .array(
      z.object({
        tag: z.string().optional(),
        difficulty: difficultyEnum.optional(),
        onlyUnsolved: z.boolean().optional(),
        count: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(10),
});
