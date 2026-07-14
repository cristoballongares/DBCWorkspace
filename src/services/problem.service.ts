import { prisma } from '@/lib/prisma';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import type { createProblemSchema, updateProblemSchema } from '@/lib/validations/problem';
import type { z } from 'zod';
import { logChange } from './changelog.service';

type CreateProblemInput = z.infer<typeof createProblemSchema>;
type UpdateProblemInput = z.infer<typeof updateProblemSchema>;

const problemInclude = {
  tags: { include: { tag: true } },
  editorial: { select: { id: true } },
  _count: { select: { solutions: true } },
};

async function resolveTagIds(tagNames: string[]) {
  const tags = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  return tags.map((tag) => tag.id);
}

export type ProblemFilters = {
  q?: string;
  tag?: string;
  difficulty?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

function buildProblemWhere(filters: Pick<ProblemFilters, 'q' | 'tag' | 'difficulty' | 'status'>) {
  return {
    title: filters.q ? { contains: filters.q, mode: 'insensitive' as const } : undefined,
    difficulty: filters.difficulty ? (filters.difficulty as Difficulty) : undefined,
    status: filters.status ? (filters.status as ProblemStatus) : undefined,
    tags: filters.tag ? { some: { tag: { name: filters.tag } } } : undefined,
  };
}

export async function listProblems(filters: ProblemFilters = {}) {
  const { page, pageSize } = filters;
  return prisma.problem.findMany({
    where: buildProblemWhere(filters),
    include: problemInclude,
    orderBy: { createdAt: 'desc' },
    ...(page && pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
  });
}

export async function countProblems(filters: ProblemFilters = {}) {
  return prisma.problem.count({ where: buildProblemWhere(filters) });
}

export async function getRandomProblem(filters: { tag?: string; difficulty?: string; onlyUnsolved?: boolean }) {
  const where = buildProblemWhere({
    tag: filters.tag,
    difficulty: filters.difficulty,
    status: filters.onlyUnsolved ? 'UNSOLVED' : undefined,
  });

  const candidates = await prisma.problem.findMany({ where, select: { id: true } });
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  if (!chosen) return null;

  return getProblem(chosen.id);
}

export async function listTags() {
  return prisma.tag.findMany({ orderBy: { name: 'asc' } });
}

export async function getProblem(id: string) {
  return prisma.problem.findUnique({
    where: { id },
    include: problemInclude,
  });
}

export async function createProblem(input: CreateProblemInput, editorId: string) {
  const tagIds = await resolveTagIds(input.tagNames);

  const problem = await prisma.problem.create({
    data: {
      title: input.title,
      source: input.source || null,
      url: input.url || null,
      difficulty: input.difficulty,
      status: input.status,
      statementNotes: input.statementNotes || null,
      tags: {
        create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
      },
    },
    include: problemInclude,
  });

  await logChange({
    entityType: 'PROBLEM',
    editorId,
    diffSummary: `Problema creado: ${problem.title}`,
    problemId: problem.id,
  });

  return problem;
}

export async function updateProblem(id: string, input: UpdateProblemInput, editorId: string) {
  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.source !== undefined) data.source = input.source || null;
  if (input.url !== undefined) data.url = input.url || null;
  if (input.difficulty !== undefined) data.difficulty = input.difficulty;
  if (input.status !== undefined) data.status = input.status;
  if (input.statementNotes !== undefined) data.statementNotes = input.statementNotes || null;

  if (input.tagNames !== undefined) {
    const tagIds = await resolveTagIds(input.tagNames);
    data.tags = {
      deleteMany: {},
      create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
    };
  }

  const problem = await prisma.problem.update({
    where: { id },
    data,
    include: problemInclude,
  });

  await logChange({
    entityType: 'PROBLEM',
    editorId,
    diffSummary: `Problema actualizado: ${problem.title}`,
    problemId: problem.id,
  });

  return problem;
}

export async function deleteProblem(id: string, editorId: string) {
  const problem = await prisma.problem.delete({ where: { id } });

  await logChange({
    entityType: 'PROBLEM',
    editorId,
    diffSummary: `Problema eliminado: ${problem.title}`,
  });

  return problem;
}
