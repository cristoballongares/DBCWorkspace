import { prisma } from '@/lib/prisma';
import { getCurrentRatings } from '@/services/rating.service';
import { getSkillStats } from '@/services/skill.service';

export async function getDashboardData(userId: string) {
  const [solvedProblemIds, totalProblems, upcomingContests, recentActivity, ratings, publicTodos, skillStats] =
    await Promise.all([
      prisma.solution.findMany({
        where: { authorId: userId },
        distinct: ['problemId'],
        select: { problemId: true },
      }),
      prisma.problem.count(),
      prisma.contest.findMany({
        where: { status: 'SCHEDULED' },
        orderBy: { startTime: 'asc' },
        take: 5,
      }),
      prisma.changeLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          editor: { select: { name: true } },
          problem: { select: { id: true, title: true } },
          contest: { select: { id: true, name: true } },
          notebookEntry: { select: { slug: true, title: true } },
        },
      }),
      getCurrentRatings(),
      prisma.publicTodo.findMany({
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { name: true } } },
      }),
      getSkillStats(userId),
    ]);

  const myRating = ratings.find((r) => r.id === userId) ?? null;

  return {
    problemsSolvedByMe: solvedProblemIds.length,
    totalProblems,
    upcomingContests,
    recentActivity,
    myRating,
    publicTodos,
    skillStats,
  };
}

export async function getTeamStats() {
  const [users, ratings] = await Promise.all([
    prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { solutions: true } } },
    }),
    getCurrentRatings(),
  ]);

  return users.map((user) => {
    const rating = ratings.find((r) => r.id === user.id);
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      solutionCount: user._count.solutions,
      rating: rating?.rating ?? null,
      lastContest: rating?.lastContest ?? null,
    };
  });
}
