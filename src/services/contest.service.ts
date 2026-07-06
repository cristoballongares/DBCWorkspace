import { prisma } from '@/lib/prisma';
import type { createContestSchema, updateContestSchema } from '@/lib/validations/contest';
import type { z } from 'zod';
import { recalculateRatingForContest } from './rating.service';
import { logChange } from '@/services/changelog.service';

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

export async function createContest(input: CreateContestInput, editorId: string) {
  const contest = await prisma.contest.create({
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

  await logChange({
    entityType: 'CONTEST',
    editorId,
    diffSummary: `Contest created: ${contest.name}`,
    contestId: contest.id,
  });

  return contest;
}

export async function updateContest(id: string, input: UpdateContestInput) {
  const { problems, ...rest } = input;

  const contest = await prisma.$transaction(async (tx) => {
    if (problems) {
      const existing = await tx.contestProblem.findMany({ where: { contestId: id } });
      const existingByProblemId = new Map(existing.map((cp) => [cp.problemId, cp]));
      const incomingProblemIds = new Set(problems.map((p) => p.problemId));

      const toDelete = existing.filter((cp) => !incomingProblemIds.has(cp.problemId));
      if (toDelete.length > 0) {
        await tx.contestProblem.deleteMany({
          where: { id: { in: toDelete.map((cp) => cp.id) } },
        });
      }

      // Relabel survivors to temp values first so swapped labels don't collide
      // with the @@unique([contestId, label]) constraint mid-transaction.
      for (const [index, p] of problems.entries()) {
        const current = existingByProblemId.get(p.problemId);
        if (current) {
          await tx.contestProblem.update({
            where: { id: current.id },
            data: { label: `_tmp_${index}` },
          });
        }
      }

      for (const [index, p] of problems.entries()) {
        const current = existingByProblemId.get(p.problemId);
        if (current) {
          await tx.contestProblem.update({
            where: { id: current.id },
            data: { label: p.label, order: index },
          });
        } else {
          await tx.contestProblem.create({
            data: { contestId: id, problemId: p.problemId, label: p.label, order: index },
          });
        }
      }
    }

    return tx.contest.update({
      where: { id },
      data: rest,
      include: contestInclude,
    });
  });

  if (input.status === 'FINISHED') {
    await recalculateRatingForContest(id);
  }

  return contest;
}

export async function deleteContest(id: string) {
  return prisma.contest.delete({ where: { id } });
}
