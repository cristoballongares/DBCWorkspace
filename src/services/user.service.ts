import { prisma } from '@/lib/prisma';
import { logChange } from './changelog.service';

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}

export async function deleteUser(id: string, editorId: string) {
  if (id === editorId) {
    throw new Error('CANNOT_DELETE_SELF');
  }

  const user = await prisma.user.delete({ where: { id } });

  await logChange({
    entityType: 'USER',
    editorId,
    diffSummary: `Usuario eliminado: ${user.name}`,
  });

  return user;
}
