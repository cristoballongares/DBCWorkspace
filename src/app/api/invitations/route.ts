import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/permissions';
import { createInvitationSchema } from '@/lib/validations/invitation';
import { createInvitation, listInvitations } from '@/services/invitation.service';

export async function GET() {
  try {
    const session = await requireAdmin();
    void session;
    const invitations = await listInvitations();
    return NextResponse.json(invitations);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    const body = await request.json();
    const parsed = createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const invitation = await createInvitation(
      parsed.data.email,
      parsed.data.role,
      session.user.id,
    );

    return NextResponse.json(invitation, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
