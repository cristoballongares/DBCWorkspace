import { prisma } from '@/lib/prisma';
import type {
  createCalendarSchema,
  createSessionSchema,
  updateSessionSchema,
} from '@/lib/validations/training';
import type { z } from 'zod';

type CreateCalendarInput = z.infer<typeof createCalendarSchema>;
type CreateSessionInput = z.infer<typeof createSessionSchema>;
type UpdateSessionInput = z.infer<typeof updateSessionSchema>;

const calendarInclude = {
  sessions: {
    include: { user: { select: { id: true, name: true } } },
    orderBy: { date: 'asc' as const },
  },
};

export async function listCalendars() {
  return prisma.trainingCalendar.findMany({
    include: calendarInclude,
    orderBy: { weekStart: 'desc' },
  });
}

export async function getCalendar(id: string) {
  return prisma.trainingCalendar.findUnique({
    where: { id },
    include: calendarInclude,
  });
}

export async function createCalendar(input: CreateCalendarInput) {
  return prisma.trainingCalendar.create({
    data: { weekStart: input.weekStart, planNotes: input.planNotes || null },
    include: calendarInclude,
  });
}

export async function createSession(
  calendarId: string,
  userId: string,
  input: CreateSessionInput,
) {
  return prisma.trainingSession.create({
    data: {
      calendarId,
      userId,
      date: input.date,
      plannedProblems: input.plannedProblems,
      notes: input.notes || null,
    },
  });
}

export async function updateSession(id: string, input: UpdateSessionInput) {
  return prisma.trainingSession.update({
    where: { id },
    data: input,
  });
}

export async function deleteSession(id: string) {
  return prisma.trainingSession.delete({ where: { id } });
}
