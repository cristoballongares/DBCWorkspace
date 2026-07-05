import { prisma } from '@/lib/prisma';
import type { upsertPostMortemSchema } from '@/lib/validations/postmortem';
import type { z } from 'zod';

type UpsertPostMortemInput = z.infer<typeof upsertPostMortemSchema>;

export async function getPostMortem(contestId: string) {
  return prisma.contestPostMortem.findUnique({ where: { contestId } });
}

export async function upsertPostMortem(
  contestId: string,
  authorId: string,
  input: UpsertPostMortemInput,
) {
  return prisma.contestPostMortem.upsert({
    where: { contestId },
    update: {
      whatWorked: input.whatWorked || null,
      whatFailed: input.whatFailed || null,
      actionItems: input.actionItems || null,
      authorId,
    },
    create: {
      contestId,
      authorId,
      whatWorked: input.whatWorked || null,
      whatFailed: input.whatFailed || null,
      actionItems: input.actionItems || null,
    },
  });
}
