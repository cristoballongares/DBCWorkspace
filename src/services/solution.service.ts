import { prisma } from '@/lib/prisma';
import type { createSolutionSchema, updateSolutionSchema } from '@/lib/validations/solution';
import type { z } from 'zod';
import { logChange } from './changelog.service';

type CreateSolutionInput = z.infer<typeof createSolutionSchema>;
type UpdateSolutionInput = z.infer<typeof updateSolutionSchema>;

const solutionInclude = {
  author: { select: { id: true, name: true } },
  problem: { select: { title: true } },
};

export async function listSolutionsByProblem(problemId: string) {
  return prisma.solution.findMany({
    where: { problemId },
    include: solutionInclude,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSolution(id: string) {
  return prisma.solution.findUnique({
    where: { id },
    include: solutionInclude,
  });
}

export async function createSolution(
  problemId: string,
  authorId: string,
  input: CreateSolutionInput,
) {
  const solution = await prisma.solution.create({
    data: {
      problemId,
      authorId,
      content: input.content,
      reasoning: input.reasoning || null,
      timeSpentMin: input.timeSpentMin,
      attemptCount: input.attemptCount,
    },
    include: solutionInclude,
  });

  await syncProblemStatus(problemId);

  await logChange({
    entityType: 'SOLUTION',
    editorId: authorId,
    diffSummary: `Solucion creada en "${solution.problem.title}"`,
    problemId,
    solutionId: solution.id,
  });

  return solution;
}

export async function updateSolution(id: string, input: UpdateSolutionInput, editorId: string) {
  const data: Record<string, unknown> = {};

  if (input.content !== undefined) data.content = input.content;
  if (input.reasoning !== undefined) data.reasoning = input.reasoning || null;
  if (input.timeSpentMin !== undefined) data.timeSpentMin = input.timeSpentMin;
  if (input.attemptCount !== undefined) data.attemptCount = input.attemptCount;

  const solution = await prisma.solution.update({
    where: { id },
    data,
    include: solutionInclude,
  });

  await logChange({
    entityType: 'SOLUTION',
    editorId,
    diffSummary: `Solucion actualizada en "${solution.problem.title}"`,
    problemId: solution.problemId,
    solutionId: solution.id,
  });

  return solution;
}

export async function deleteSolution(id: string, editorId: string) {
  const solution = await prisma.solution.delete({ where: { id }, include: solutionInclude });
  await syncProblemStatus(solution.problemId);

  await logChange({
    entityType: 'SOLUTION',
    editorId,
    diffSummary: `Solucion eliminada en "${solution.problem.title}"`,
    problemId: solution.problemId,
  });

  return solution;
}

// Un problema pasa a SOLVED_TEAM cuando al menos dos personas distintas lo
// han resuelto (conocimiento consolidado de equipo); con una sola persona
// queda en SOLVED_INDIVIDUAL. Se recalcula en cada create/delete de solucion.
async function syncProblemStatus(problemId: string) {
  const solutions = await prisma.solution.findMany({
    where: { problemId },
    select: { authorId: true },
  });

  const distinctAuthors = new Set(solutions.map((s) => s.authorId)).size;

  const status =
    distinctAuthors === 0 ? 'UNSOLVED' : distinctAuthors === 1 ? 'SOLVED_INDIVIDUAL' : 'SOLVED_TEAM';

  await prisma.problem.update({
    where: { id: problemId },
    data: { status },
  });
}
