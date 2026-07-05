import { prisma } from '@/lib/prisma';
import type { ChangeLogEntity } from '@prisma/client';

export async function logChange(params: {
  entityType: ChangeLogEntity;
  editorId: string;
  diffSummary: string;
  problemId?: string;
  solutionId?: string;
  editorialId?: string;
}) {
  return prisma.changeLog.create({
    data: {
      entityType: params.entityType,
      editorId: params.editorId,
      diffSummary: params.diffSummary,
      problemId: params.problemId,
      solutionId: params.solutionId,
      editorialId: params.editorialId,
    },
  });
}
