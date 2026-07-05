import { prisma } from '@/lib/prisma';
import type { createSubmissionSchema } from '@/lib/validations/submission';
import type { z } from 'zod';

type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export async function listSubmissionsByContest(contestId: string) {
  return prisma.contestSubmission.findMany({
    where: { contestId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { minutesFromStart: 'asc' },
  });
}

export async function createSubmission(
  contestId: string,
  userId: string,
  input: CreateSubmissionInput,
) {
  return prisma.contestSubmission.create({
    data: {
      contestId,
      userId,
      contestProblemId: input.contestProblemId,
      verdict: input.verdict,
      minutesFromStart: input.minutesFromStart,
    },
  });
}

export type ScoreboardCell = {
  contestProblemId: string;
  label: string;
  attempts: number;
  solvedAtMin: number | null;
  frozen: boolean;
};

export type ScoreboardRow = {
  userId: string;
  userName: string;
  cells: ScoreboardCell[];
  solvedCount: number;
  totalPenalty: number;
};

export async function computeScoreboard(contestId: string) {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
      problems: {
        include: { problem: { select: { title: true } } },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!contest) return null;

  const [submissions, users] = await Promise.all([
    prisma.contestSubmission.findMany({
      where: { contestId },
      orderBy: { minutesFromStart: 'asc' },
    }),
    prisma.user.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const freezeThreshold = contest.durationMin - contest.freezeMin;
  const isFrozenView = contest.status === 'FROZEN';

  const rows: ScoreboardRow[] = users.map((user) => {
    const cells: ScoreboardCell[] = contest.problems.map((cp) => {
      const subs = submissions.filter(
        (s) => s.userId === user.id && s.contestProblemId === cp.id,
      );

      let attempts = 0;
      let solvedAtMin: number | null = null;
      let frozen = false;

      for (const s of subs) {
        const hidden = isFrozenView && s.minutesFromStart > freezeThreshold;
        if (hidden) {
          frozen = true;
          continue;
        }
        if (s.verdict === 'AC') {
          solvedAtMin = s.minutesFromStart;
          break;
        }
        if (s.verdict !== 'PENDING') attempts++;
      }

      return { contestProblemId: cp.id, label: cp.label, attempts, solvedAtMin, frozen };
    });

    const solvedCount = cells.filter((c) => c.solvedAtMin !== null).length;
    const totalPenalty = cells.reduce(
      (sum, c) => (c.solvedAtMin !== null ? sum + c.solvedAtMin! + c.attempts * contest.penaltyMin : sum),
      0,
    );

    return { userId: user.id, userName: user.name, cells, solvedCount, totalPenalty };
  });

  rows.sort((a, b) => b.solvedCount - a.solvedCount || a.totalPenalty - b.totalPenalty);

  return { contest, rows };
}
