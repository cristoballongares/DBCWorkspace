import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/permissions';
import { upsertPostMortemSchema } from '@/lib/validations/postmortem';
import { getPostMortem, upsertPostMortem } from '@/services/postmortem.service';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    await requireSession();
    const postMortem = await getPostMortem(params.id);

    if (!postMortem) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(postMortem);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = upsertPostMortemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const postMortem = await upsertPostMortem(params.id, session.user.id, parsed.data);
    return NextResponse.json(postMortem);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
