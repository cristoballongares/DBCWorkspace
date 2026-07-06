import { prisma } from '@/lib/prisma';
import type { Difficulty } from '@prisma/client';

// Peso por dificultad: problemas dificiles valen mas puntos de rating por
// resolverlos rapido que uno facil. UNRATED se trata como EASY (sin info).
const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  UNRATED: 1,
};

const ATTEMPT_PENALTY = 5;

// Recalcula el rating de cada miembro del equipo tras cerrar un contest:
// percentil del tiempo de resolucion (mas rapido = mejor) ponderado por
// dificultad, menos una penalizacion por intento fallido. Se guarda un
// snapshot por (usuario, contest); no es un rating Elo acumulativo.
export async function recalculateRatingForContest(contestId: string) {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: { problems: { include: { problem: { select: { difficulty: true } } } } },
  });

  if (!contest) return;

  const submissions = await prisma.contestSubmission.findMany({
    where: { contestId },
    orderBy: { minutesFromStart: 'asc' },
  });

  type SolveInfo = { userId: string; solvedAtMin: number; attempts: number };
  const solvesByProblem = new Map<string, SolveInfo[]>();

  for (const cp of contest.problems) {
    const subsByUser = new Map<string, typeof submissions>();
    for (const s of submissions.filter((s) => s.contestProblemId === cp.id && s.userId !== null)) {
      const userId = s.userId as string;
      const list = subsByUser.get(userId) ?? [];
      list.push(s);
      subsByUser.set(userId, list);
    }

    const solves: SolveInfo[] = [];
    for (const [userId, subs] of subsByUser) {
      let attempts = 0;
      for (const s of subs) {
        if (s.verdict === 'AC') {
          solves.push({ userId, solvedAtMin: s.minutesFromStart, attempts });
          break;
        }
        if (s.verdict !== 'PENDING') attempts++;
      }
    }

    solvesByProblem.set(cp.id, solves);
  }

  const scoresByUser = new Map<string, number[]>();

  for (const cp of contest.problems) {
    const solves = solvesByProblem.get(cp.id) ?? [];
    if (solves.length === 0) continue;

    const sorted = [...solves].sort((a, b) => a.solvedAtMin - b.solvedAtMin);
    const weight = DIFFICULTY_WEIGHT[cp.problem.difficulty];

    sorted.forEach((solve, rank) => {
      const percentile =
        sorted.length === 1 ? 100 : ((sorted.length - 1 - rank) / (sorted.length - 1)) * 100;
      const score = Math.max(0, percentile * weight - solve.attempts * ATTEMPT_PENALTY);

      const list = scoresByUser.get(solve.userId) ?? [];
      list.push(score);
      scoresByUser.set(solve.userId, list);
    });
  }

  await Promise.all(
    Array.from(scoresByUser.entries()).map(([userId, scores]) => {
      const value = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      return prisma.ratingSnapshot.upsert({
        where: { userId_contestId: { userId, contestId } },
        update: { value },
        create: { userId, contestId, value },
      });
    }),
  );
}

export async function listRatingHistory(userId: string) {
  return prisma.ratingSnapshot.findMany({
    where: { userId },
    include: { contest: { select: { id: true, name: true, startTime: true } } },
    orderBy: { contest: { startTime: 'asc' } },
  });
}

export async function getCurrentRatings() {
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
    include: {
      ratingSnapshots: {
        orderBy: { contest: { startTime: 'desc' } },
        take: 1,
        include: { contest: { select: { name: true, startTime: true } } },
      },
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    rating: user.ratingSnapshots[0]?.value ?? null,
    lastContest: user.ratingSnapshots[0]?.contest.name ?? null,
  }));
}
