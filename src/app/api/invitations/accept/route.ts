import { NextResponse } from 'next/server';
import { acceptInvitationSchema } from '@/lib/validations/invitation';
import { acceptInvitation } from '@/services/invitation.service';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = acceptInvitationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const user = await acceptInvitation(parsed.data.token, parsed.data.name, parsed.data.password);
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 400 });
  }
}
