import { prisma } from '@/lib/prisma';
import type { upsertEditorialSchema } from '@/lib/validations/editorial';
import type { z } from 'zod';
import { logChange } from './changelog.service';

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
  const editorial = await prisma.editorial.upsert({
    where: { problemId },
    update: { content: input.content, authorId },
    create: { problemId, authorId, content: input.content },
    include: editorialInclude,
  });

  await logChange({
    entityType: 'EDITORIAL',
    editorId: authorId,
    diffSummary: `Editorial guardado para problema ${problemId}`,
    problemId,
    editorialId: editorial.id,
  });

  return editorial;
}

export async function deleteEditorial(problemId: string, editorId: string) {
  const editorial = await prisma.editorial.delete({ where: { problemId } });

  await logChange({
    entityType: 'EDITORIAL',
    editorId,
    diffSummary: `Editorial eliminado para problema ${problemId}`,
    problemId,
  });

  return editorial;
}
