import { prisma } from '@/lib/prisma';
import type { createTopicSchema, updateTopicSchema } from '@/lib/validations/topic';
import type { z } from 'zod';
import { logChange } from './changelog.service';

type CreateTopicInput = z.infer<typeof createTopicSchema>;
type UpdateTopicInput = z.infer<typeof updateTopicSchema>;

const topicInclude = {
  author: { select: { id: true, name: true } },
  exercises: {
    include: { problem: { select: { id: true, title: true, difficulty: true } } },
  },
  parent: {
    select: {
      id: true,
      slug: true,
      title: true,
      children: {
        select: { id: true, slug: true, title: true },
        orderBy: [{ order: 'asc' as const }, { title: 'asc' as const }],
      },
    },
  },
  children: {
    select: { id: true, slug: true, title: true, order: true },
    orderBy: [{ order: 'asc' as const }, { title: 'asc' as const }],
  },
  _count: { select: { children: true } },
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uniqueSlug(title: string) {
  const base = slugify(title) || 'tema';
  let slug = base;
  let suffix = 1;
  while (await prisma.notebookEntry.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

// Solo temas de nivel superior (sin padre); los subtemas se navegan desde
// el detalle de su tema padre para no saturar el listado principal.
export async function listTopics() {
  return prisma.notebookEntry.findMany({
    where: { parentId: null },
    include: topicInclude,
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
  });
}

export async function listTopicCategories() {
  const rows = await prisma.notebookEntry.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  });
  return rows.map((r) => r.category);
}

export async function listParentCandidates(excludeId?: string) {
  return prisma.notebookEntry.findMany({
    where: { parentId: null, id: excludeId ? { not: excludeId } : undefined },
    select: { id: true, title: true },
    orderBy: { title: 'asc' },
  });
}

export async function getTopicBySlug(slug: string) {
  return prisma.notebookEntry.findUnique({
    where: { slug },
    include: topicInclude,
  });
}

export async function createTopic(input: CreateTopicInput, authorId: string) {
  const slug = await uniqueSlug(input.title);

  const topic = await prisma.notebookEntry.create({
    data: {
      slug,
      title: input.title,
      category: input.category,
      content: input.content,
      commonPitfalls: input.commonPitfalls || null,
      authorId,
      parentId: input.parentId || null,
      order: input.order ?? 0,
      exercises: {
        create: input.problemIds.map((problemId) => ({ problem: { connect: { id: problemId } } })),
      },
    },
    include: topicInclude,
  });

  await logChange({
    entityType: 'NOTEBOOK_ENTRY',
    editorId: authorId,
    diffSummary: `Tema creado: ${topic.title}`,
    notebookEntryId: topic.id,
  });

  return topic;
}

export async function updateTopic(id: string, input: UpdateTopicInput, editorId: string) {
  const data: Record<string, unknown> = {};

  if (input.title !== undefined) data.title = input.title;
  if (input.category !== undefined) data.category = input.category;
  if (input.content !== undefined) data.content = input.content;
  if (input.commonPitfalls !== undefined) data.commonPitfalls = input.commonPitfalls || null;
  if (input.parentId !== undefined) data.parentId = input.parentId || null;
  if (input.order !== undefined) data.order = input.order;

  if (input.problemIds !== undefined) {
    data.exercises = {
      deleteMany: {},
      create: input.problemIds.map((problemId) => ({ problem: { connect: { id: problemId } } })),
    };
  }

  const topic = await prisma.notebookEntry.update({
    where: { id },
    data,
    include: topicInclude,
  });

  await logChange({
    entityType: 'NOTEBOOK_ENTRY',
    editorId,
    diffSummary: `Tema actualizado: ${topic.title}`,
    notebookEntryId: topic.id,
  });

  return topic;
}

export async function deleteTopic(id: string, editorId: string) {
  const topic = await prisma.notebookEntry.delete({ where: { id } });

  await logChange({
    entityType: 'NOTEBOOK_ENTRY',
    editorId,
    diffSummary: `Tema eliminado: ${topic.title}`,
  });

  return topic;
}
