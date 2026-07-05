import { prisma } from '@/lib/prisma';
import type { Difficulty, ProblemStatus } from '@prisma/client';
import type { createProblemSchema, updateProblemSchema } from '@/lib/validations/problem';
import type { z } from 'zod';

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
};

export async function listProblems(filters: ProblemFilters = {}) {
  return prisma.problem.findMany({
    where: {
      title: filters.q ? { contains: filters.q, mode: 'insensitive' } : undefined,
      difficulty: filters.difficulty ? (filters.difficulty as Difficulty) : undefined,
      status: filters.status ? (filters.status as ProblemStatus) : undefined,
      tags: filters.tag ? { some: { tag: { name: filters.tag } } } : undefined,
    },
    include: problemInclude,
    orderBy: { createdAt: 'desc' },
  });
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

export async function createProblem(input: CreateProblemInput) {
  const tagIds = await resolveTagIds(input.tagNames);

  return prisma.problem.create({
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
}

export async function updateProblem(id: string, input: UpdateProblemInput) {
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

  return prisma.problem.update({
    where: { id },
    data,
    include: problemInclude,
  });
}

export async function deleteProblem(id: string) {
  return prisma.problem.delete({ where: { id } });
}
