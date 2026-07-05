import { z } from 'zod';

export const createCalendarSchema = z.object({
  weekStart: z.coerce.date(),
  planNotes: z.string().optional(),
});

export const createSessionSchema = z.object({
  date: z.coerce.date(),
  plannedProblems: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

export const updateSessionSchema = z.object({
  plannedProblems: z.number().int().nonnegative().optional(),
  actualProblems: z.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});
