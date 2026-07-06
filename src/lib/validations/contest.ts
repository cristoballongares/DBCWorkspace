import { z } from 'zod';

const contestStatusEnum = z.enum(['SCHEDULED', 'RUNNING', 'FROZEN', 'FINISHED']);

export const contestProblemInputSchema = z.object({
  problemId: z.string().min(1),
  label: z.string().min(1).max(2),
});

export const createContestSchema = z.object({
  name: z.string().min(1),
  startTime: z.coerce.date(),
  durationMin: z.number().int().positive().default(300),
  penaltyMin: z.number().int().nonnegative().default(20),
  freezeMin: z.number().int().nonnegative().default(60),
  problems: z.array(contestProblemInputSchema).optional().default([]),
});

export const updateContestSchema = z.object({
  name: z.string().min(1).optional(),
  startTime: z.coerce.date().optional(),
  durationMin: z.number().int().positive().optional(),
  penaltyMin: z.number().int().nonnegative().optional(),
  freezeMin: z.number().int().nonnegative().optional(),
  status: contestStatusEnum.optional(),
  problems: z.array(contestProblemInputSchema).optional(),
});
