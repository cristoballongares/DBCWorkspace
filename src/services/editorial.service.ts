import { prisma } from '@/lib/prisma';
import type { upsertEditorialSchema } from '@/lib/validations/editorial';
import type { z } from 'zod';

type UpsertEditorialInput = z.infer<typeof upsertEditorialSchema>;

const editorialInclude = {
  author: { select: { id: true, name: true } },
};

export async function getEditorialByProblem(problemId: string) {
  return prisma.editorial.findUnique({
    where: { problemId },
    include: editorialInclude,
  });
}

export async function upsertEditorial(
  problemId: string,
  authorId: string,
  input: UpsertEditorialInput,
) {
  return prisma.editorial.upsert({
    where: { problemId },
    update: { content: input.content, authorId },
    create: { problemId, authorId, content: input.content },
    include: editorialInclude,
  });
}

export async function deleteEditorial(problemId: string) {
  return prisma.editorial.delete({ where: { problemId } });
}
