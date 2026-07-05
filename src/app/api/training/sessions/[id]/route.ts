import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { updateSessionSchema } from '@/lib/validations/training';
import { deleteSession, updateSession } from '@/services/training.service';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const body = await request.json();
    const parsed = updateSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const trainingSession = await updateSession(params.id, parsed.data);
    return NextResponse.json(trainingSession);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    await deleteSession(params.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
