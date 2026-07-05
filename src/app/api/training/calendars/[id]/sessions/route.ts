import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { createSessionSchema } from '@/lib/validations/training';
import { createSession } from '@/services/training.service';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = createSessionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const trainingSession = await createSession(params.id, session.user.id, parsed.data);
    return NextResponse.json(trainingSession, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
