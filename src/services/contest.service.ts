import { prisma } from '@/lib/prisma';
import type { createContestSchema, updateContestSchema } from '@/lib/validations/contest';
import type { z } from 'zod';
import { recalculateRatingForContest } from './rating.service';

type CreateContestInput = z.infer<typeof createContestSchema>;
type UpdateContestInput = z.infer<typeof updateContestSchema>;

const contestInclude = {
  problems: {
    include: { problem: { select: { id: true, title: true, difficulty: true } } },
    orderBy: { order: 'asc' as const },
  },
  postMortem: true,
};

export async function listContests() {
  return prisma.contest.findMany({
    include: contestInclude,
    orderBy: { startTime: 'desc' },
  });
}

export async function getContest(id: string) {
  return prisma.contest.findUnique({
    where: { id },
    include: contestInclude,
  });
}

export async function createContest(input: CreateContestInput) {
  return prisma.contest.create({
    data: {
      name: input.name,
      startTime: input.startTime,
      durationMin: input.durationMin,
      penaltyMin: input.penaltyMin,
      freezeMin: input.freezeMin,
      problems: {
        create: input.problems.map((p, index) => ({
          problemId: p.problemId,
          label: p.label,
          order: index,
        })),
      },
    },
    include: contestInclude,
  });
}

export async function updateContest(id: string, input: UpdateContestInput) {
  const contest = await prisma.contest.update({
    where: { id },
    data: input,
    include: contestInclude,
  });

  if (input.status === 'FINISHED') {
    await recalculateRatingForContest(id);
  }

  return contest;
}

export async function deleteContest(id: string) {
  return prisma.contest.delete({ where: { id } });
}
