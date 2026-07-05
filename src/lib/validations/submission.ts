import { z } from 'zod';

const verdictEnum = z.enum(['PENDING', 'AC', 'WA', 'TLE', 'RE', 'CE', 'OTHER']);

export const createSubmissionSchema = z.object({
  contestProblemId: z.string().min(1),
  verdict: verdictEnum,
  minutesFromStart: z.number().int().nonnegative(),
});
