import { randomBytes } from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const INVITATION_TTL_DAYS = 7;

export async function createInvitation(email: string, role: 'ADMIN' | 'MEMBER', invitedById: string) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);

  return prisma.invitation.create({
    data: { email, role, token, expiresAt, invitedById },
  });
}

export async function listInvitations() {
  return prisma.invitation.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getValidInvitation(token: string) {
  const invitation = await prisma.invitation.findUnique({ where: { token } });
  if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
    return null;
  }
  return invitation;
}

export async function acceptInvitation(token: string, name: string, password: string) {
  const invitation = await getValidInvitation(token);
  if (!invitation) {
    throw new Error('INVALID_INVITATION');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await prisma.$transaction([
    prisma.user.create({
      data: {
        email: invitation.email,
        name,
        role: invitation.role,
        passwordHash,
      },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { acceptedAt: new Date() },
    }),
  ]);

  return user;
}
