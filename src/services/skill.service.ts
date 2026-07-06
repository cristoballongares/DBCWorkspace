import { prisma } from '@/lib/prisma';
import { SKILL_AREAS, TAG_TO_AREA, type SkillArea } from '@/lib/skill-areas';

export type SkillStat = {
  area: SkillArea;
  solved: number;
  total: number;
  percentage: number;
};

export async function getSkillStats(userId: string): Promise<SkillStat[]> {
  const problems = await prisma.problem.findMany({
    select: {
      id: true,
      tags: { select: { tag: { select: { name: true } } } },
      solutions: { where: { authorId: userId }, select: { id: true }, take: 1 },
    },
  });

  const total = new Map<SkillArea, number>();
  const solved = new Map<SkillArea, number>();
  for (const area of SKILL_AREAS) {
    total.set(area, 0);
    solved.set(area, 0);
  }

  for (const problem of problems) {
    const areas = new Set<SkillArea>();
    for (const { tag } of problem.tags) {
      const area = TAG_TO_AREA[tag.name];
      if (area) areas.add(area);
    }

    const isSolvedByUser = problem.solutions.length > 0;
    for (const area of areas) {
      total.set(area, (total.get(area) ?? 0) + 1);
      if (isSolvedByUser) solved.set(area, (solved.get(area) ?? 0) + 1);
    }
  }

  return SKILL_AREAS.map((area) => {
    const areaTotal = total.get(area) ?? 0;
    const areaSolved = solved.get(area) ?? 0;
    return {
      area,
      solved: areaSolved,
      total: areaTotal,
      percentage: areaTotal === 0 ? 0 : Math.round((areaSolved / areaTotal) * 100),
    };
  });
}
